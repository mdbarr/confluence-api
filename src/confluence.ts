import fetch from 'node-fetch';
import { createReadStream } from 'fs';
const FormData = require('form-data');

/**
 * Configuration of the client
 */
export interface Config {
  username: string;
  password: string;
  baseUrl: string;
  version?: number;
  apiPath?: string;
}

/**
 * Configuration enhanced with computed information
 */
interface InternalConfig extends Config {
  extension: string;
}

/**
 * Space definition
 */
export interface Space {
  id: number,
  key: string,
  type: string,
  status: string,
  _expandable: {
    settings: string,
    homepage: string,
    identifiers: string,
    [key: string]: string
  }
}

/**
 * Page definition
 */
export interface Page {
  id: string;
}

/**
 * Main Confluence API client class
 */
export default class Confluence {
  config: InternalConfig;

  /**
   * Create a new client
   *
   * Password can either be the user password or a user token
   *
   * @param config of the client
   */
  constructor(config: Config) {
    this.config = {
      username: config.username,
      password: config.password,
      baseUrl: config.baseUrl,
      version: config.version,
      apiPath: config.apiPath || (config.version === 4) ? '/rest/prototype/latest' : '/rest/api',
      extension: (config.version === 4) ? '.json' : ''
    };
  }

  /**
   * Do a request on the API
   *
   * @param url to fetch
   * @param method to use
   * @param toJSON parse result into JSON Object
   * @param body content of the request
   */
  async fetch(url: string, method = 'GET', toJSON = true, body: any = undefined,): Promise<any> {
    const auth = Buffer
      .from(`${this.config.username}:${this.config.password}`)
      .toString('base64');
    const headers: any = {
      'Content-Type': 'application/json',
      'Authorization':
      `Basic ${auth}`
    }
    let options: any = {
      headers,
      method
    }
    if (body && typeof (body) !== 'string' && typeof (body) !== 'undefined') {
      body = JSON.stringify(body);
      options = { ...options, body: body }
    }
    const res = await fetch(url, options);
    if (toJSON) {
      return res.json();
    }
    return await res.buffer();
  }

  /**
   * Return all known spaces to the user
   */
  async getSpaces(): Promise<Space[]> {
    const spaces = [];
    let start = 0;
    let res;
    do {
      const url = this.config.baseUrl + this.config.apiPath + '/space' + this.config.extension + `?limit=100&start=${start}`;
      res = await this.fetch(url, 'GET', true);
      spaces.push(...res.results);
      start = res.start + res.limit;
    } while (res.size === res.limit)
    // Handle pagination here
    return spaces;
  }

  /**
   * Return one specific space
   *
   * @param space to retrieve
   * @throw Error SPACE not found if not found
   */
  async getSpace(spaceKey: string): Promise<Space> {
    const url = this.config.baseUrl + this.config.apiPath + '/space' + this.config.extension + '?spaceKey=' + spaceKey;
    const res = await this.fetch(url);
    if (res.size === 0) {
      throw new Error('SPACE not found');
    }
    return res.results[0];
  }

  /**
   *
   * @param spaceKey  to retrieve home page from
   */
  async getSpaceHomePage(spaceKey: string): Promise<Page> {
    return await this.fetch(this.config.baseUrl + (await this.getSpace(spaceKey))._expandable.homepage);
  }

  async getContentById(id) {
    const url = this.config.baseUrl + this.config.apiPath + '/content/' + id + this.config.extension + '?expand=body.storage,version';
    return (await this.fetch(url));
  }

  async getCustomContentById(options: any) {
    const expanders = options.expanders || ['body.storage', 'version'];
    const url = this.config.baseUrl + this.config.apiPath + '/content/' + options.id + this.config.extension + '?expand=' + expanders.join();
    return (await this.fetch(url));
  }

  async getContentByPageTitle(space: string, title: string) {
    const query = '?spaceKey=' + space + '&title=' + title + '&expand=body.storage,version';
    const url = this.config.baseUrl + this.config.apiPath + '/content' + this.config.extension + query;
    return (await this.fetch(url));
  }

  async postContent(space: string, title: string, content: string, parentId: string = undefined, metadata: any = {}, representation = 'storage') {
    const page = {
      'type': 'page',
      'title': title,
      'space': {
        'key': space
      },
      'ancestors': [{
        'type': 'page',
        'id': parentId ? parentId : (await this.getSpaceHomePage(space)).id
      }],
      'body': {
        'storage': {
          'value': content,
          'representation': representation
        }
      },
      'metadata': metadata,
    };

    const url = this.config.baseUrl + this.config.apiPath + '/content' + this.config.extension;
    return (await this.fetch(url, 'POST', true, page))
  }

  async putContent(space: string, id: string, version: number, title: string, content: string, minorEdit?: boolean, representation?: string) {
    const page = {
      'id': id,
      'type': 'page',
      'title': title,
      'space': {
        'key': space
      },
      'version': {
        'number': version,
        'minorEdit': minorEdit || false
      },
      'body': {
        'storage': {
          'value': content,
          'representation': representation || 'storage'
        }
      }
    };
    const url = this.config.baseUrl + this.config.apiPath + '/content/' + id + this.config.extension + '?expand=body.storage,version';
    return (await this.fetch(url, 'PUT', true, page))
  }

  async deleteContent(id: string) {
    const url = this.config.baseUrl + this.config.apiPath + '/content/' + id + this.config.extension;
    return (await this.fetch(url, 'DELETE'))
  }

  async getAttachments(space: string, id: string) {
    const query = '?spaceKey=' + space + '&expand=version,container';
    const url = this.config.baseUrl + this.config.apiPath + '/content/' + id + '/child/attachment' + query;
    return (await this.fetch(url))
  }

  async createAttachment(id: string, filepath: string, comment = '', minorEdit = false) {
    const auth = Buffer
      .from(`${this.config.username}:${this.config.password}`)
      .toString('base64');
    const headers: any = {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Basic ${auth}`,
      'X-Atlassian-Token': 'nocheck'
    }
    const method = 'POST';
    const url = this.config.baseUrl + this.config.apiPath + '/content/' + id + '/child/attachment';
    const form = new FormData();
    form.append('comment', comment);
    form.append('minorEdit', minorEdit);
    form.append('file', createReadStream(filepath));
    await fetch(url, { headers, method, body: form.getBuffer() });
  }

  async updateAttachmentData(id: string, attachmentId: string, filepath: string, comment = '', minorEdit = false) {
    const auth = Buffer
      .from(`${this.config.username}:${this.config.password}`)
      .toString('base64');
    const headers: any = {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Basic ${auth}`,
      'X-Atlassian-Token': 'nocheck'
    };
    const method = 'PUT';
    const url = this.config.baseUrl + this.config.apiPath + '/content/' + id + '/child/attachment/' + attachmentId + '/data';
    const form = new FormData();
    form.append('comment', comment);
    form.append('minorEdit', minorEdit);
    form.append('file', createReadStream(filepath));
    await fetch(url, { headers, method, body: form.getBuffer() });
  }

  async getLabels(id: string) {
    const url = this.config.baseUrl + this.config.apiPath + '/content/' + id + '/label';
    return (await this.fetch(url));
  }

  async postLabels(id: string, labels: string) {
    const url = this.config.baseUrl + this.config.apiPath + '/content/' + id + '/label';
    return (await this.fetch(url, 'POST', true, labels));
  }

  async deleteLabel(id: string, label: string) {
    const url = this.config.baseUrl + this.config.apiPath + '/content/' + id + '/label?name=' + label;
    return (await this.fetch(url, 'DELETE'));

  }

  async search(query: string) {
    const url = this.config.baseUrl + this.config.apiPath + '/search' + this.config.extension + '?' + query;
    return (await this.fetch(url));
  }

  async getContentChildByContentId(id: string, child_type: string) {
    const url = this.config.baseUrl + this.config.apiPath +
      '/content/' + id +
      '/child/' + child_type + '?expand=body.storage,version';
    return (await this.fetch(url));
  }

  async getContentDescendantByContentId(id: string, child_type: string) {
    const url = this.config.baseUrl + this.config.apiPath +
      '/content/' + id +
      '/descendant/' + child_type + '?expand=body.storage,version';
    return (await this.fetch(url));
  }

  async getPageAsPdf(id): Promise<any> {
    const url = this.config.baseUrl + `/spaces/flyingpdf/pdfpageexport.action?pageId=${id}`;
    const res = await this.fetch(url, 'GET', false);
    // extract ajs-taskId
    const taskIdRegex = /name="ajs-taskId" content="(.*?)">/;
    const taskId = taskIdRegex.exec(res)[1];
    let timeout = 24;
    while (timeout-- > 0) {
      // pending for 5s
      await new Promise(resolve => setTimeout(resolve, 5000));
      const taskUrl = this.config.baseUrl + `/runningtaskxml.action?taskId=${taskId}`;
      const statusResAsText = await this.fetch(taskUrl, 'GET', false);
      // read pdf processing status
      const isCompleteRegex = /<isComplete>(.*?)<\/isComplete>/;
      const isComplete = isCompleteRegex.exec(statusResAsText);
      //
      if (isComplete && isComplete[1] === 'true') {
        const isSuccessfullRegex = /<isSuccessful>(.*?)<\/isSuccessful>/;
        const isSuccessful = isSuccessfullRegex.exec(statusResAsText);
        if (!isSuccessful || isSuccessful[1] !== 'true') {
          throw new Error('Pdf could not be retrieved');
        }
        const pdfUrlRegex = /href=&quot;\/wiki\/(.*?)&quot/;
        const pdfUrl = this.config.baseUrl + '/' + pdfUrlRegex.exec(statusResAsText)[1];
        const pdfresp = await this.fetch(pdfUrl, 'GET', false);
        return pdfresp;
      }
    }
    throw new Error('Pdf Generation Timeout');
  }
}

export { Confluence };
