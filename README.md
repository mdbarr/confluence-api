# Confluence API
This project contains a Node.js module which wraps Atlassian's [Confluence API](https://docs.atlassian.com/atlassian-confluence/REST/latest/).

## Dependencies
[node-fetch](https://www.npmjs.com/package/node-fetch)
[form-data](https://www.npmjs.com/package/form-data)
[@types/node](https://www.npmjs.com/package/@types/node)

## Getting Started
Install confluence-api via npm:
```
$ npm install confluence-api
```

Create an instance of Confluence by providing a username and password (or token) and a baseUrl used for all future requests.  Confluence uses [basic http authentication](https://developer.atlassian.com/cloud/confluence/basic-auth-for-rest-apis/). For instance:
```javascript
import Confluence from "confluence-api";
let config = {
    username: "testuser",
    password: "test-user-pw-or-rest-api-token",
    baseUrl:  "https://confluence-api-test.atlassian.net/wiki",
    version: 4 // Confluence major version, optional
};
const confluence = new Confluence(config);
let data = await confluence.getContentByPageTitle("space-name", "page-title");
    // do something interesting with data; for instance,
    // data.results[0].body.storage.value contains the stored markup for the first
    // page found in space 'space-name' matching page title 'page-title'

```

Confluence currently exposes the following API...

<a name="Confluence"></a>

## Confluence
**Kind**: global class
**this**: <code>{Confluence}</code>

* [Confluence](#Confluence)
    * [new Confluence(config)](#new_Confluence_new)
    * [.getSpaces(space, callback)](#Confluence+getSpaces)
    * [.getSpace(space, callback)](#Confluence+getSpace)
    * [.getSpaceHomePage(space, callback)](#Confluence+getSpaceHomePage)
    * [.getContentById(id, callback)](#Confluence+getContentById)
    * [.getCustomContentById(options, callback)](#Confluence+getCustomContentById)
    * [.getContentByPageTitle(space, title, callback)](#Confluence+getContentByPageTitle)
    * [.postContent(space, title, content, parentId, callback, representation)](#Confluence+postContent)
    * [.putContent(space, id, version, title, content, callback, minorEdit, representation)](#Confluence+putContent)
    * [.deleteContent(id, callback)](#Confluence+deleteContent)
    * [.getAttachments(space, id, callback)](#Confluence+getAttachments)
    * [.createAttachment(space, id, filepath, callback)](#Confluence+createAttachment)
    * [.updateAttachmentData(space, id, attachmentId, filepath, callback)](#Confluence+updateAttachmentData)
    * [.getLabels(id, callback)](#Confluence+getLabels)
    * [.postLabels(id, labels, callback)](#Confluence+postLabels)
    * [.deleteLabel(id, label, callback)](#Confluence+deleteLabel)
    * [.search(query, callback)](#Confluence+search)
    * [.getContentChildByContentId(id, child_type)](#Confluence+getContentChildByContentId)
    * [.getContentDescendantByContentId(id, child_type)](#Confluence+getContentDescendantByContentId)
    * [.getPageAsPdf(id)](#Confluence+getPageAsPdf)

<a name="new_Confluence_new"></a>

### new Confluence(config)
Construct Confluence.


| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> |  |
| config.username | <code>string</code> |  |
| config.password | <code>string</code> | The password or REST API Token for the user ([docs](https://developer.atlassian.com/cloud/confluence/basic-auth-for-rest-apis/)) |
| config.baseUrl | <code>string</code> |  |
| config.version | <code>number</code> | Optional |

<a name="Confluence+getSpaces"></a>

### confluence.getSpaces()
Get all spaces information, cycling through res.limit.

**Kind**: instance method of [<code>Confluence</code>](#Confluence)

<a name="Confluence+getSpace"></a>

### confluence.getSpace(space)
Get space information.

**Kind**: instance method of [<code>Confluence</code>](#Confluence)

| Param | Type |
| --- | --- |
| space | <code>string</code> |

<a name="Confluence+getSpaceHomePage"></a>

### confluence.getSpaceHomePage(space)
Get space home page.

**Kind**: instance method of [<code>Confluence</code>](#Confluence)

| Param | Type |
| --- | --- |
| space | <code>string</code> |

<a name="Confluence+getContentById"></a>

### confluence.getContentById(id)
Get stored content for a specific space and page title.

**Kind**: instance method of [<code>Confluence</code>](#Confluence)

| Param | Type |
| --- | --- |
| id | <code>string</code> |

<a name="Confluence+getCustomContentById"></a>

### confluence.getCustomContentById(options)
Get stored content for a specific page id with optional custom expanders.

**Kind**: instance method of [<code>Confluence</code>](#Confluence)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | for the custom content request |

<a name="Confluence+getContentByPageTitle"></a>

### confluence.getContentByPageTitle(space, title)
Get stored content for a specific space and page title.

**Kind**: instance method of [<code>Confluence</code>](#Confluence)

| Param | Type |
| --- | --- |
| space | <code>string</code> |
| title | <code>string</code> |

<a name="Confluence+postContent"></a>

### confluence.postContent(space, title, content, parentId, representation)
Post content to a new page.

**Kind**: instance method of [<code>Confluence</code>](#Confluence)

| Param | Type | Description |
| --- | --- | --- |
| space | <code>string</code> |  |
| title | <code>string</code> |  |
| content | <code>string</code> |  |
| parentId | <code>number</code> | A null value will cause the page to be added under the space's home page |
| representation | <code>string</code> | Optional |

<a name="Confluence+putContent"></a>

### confluence.putContent(space, id, version, title, content, minorEdit, representation)
Put/update stored content for a page.

**Kind**: instance method of [<code>Confluence</code>](#Confluence)

| Param | Type | Description |
| --- | --- | --- |
| space | <code>string</code> |  |
| id | <code>string</code> |  |
| version | <code>number</code> |  |
| title | <code>string</code> |  |
| content | <code>string</code> |  |
| minorEdit | <code>boolean</code> | Optional |
| representation | <code>string</code> | Optional |

<a name="Confluence+deleteContent"></a>

### confluence.deleteContent(id)
Delete a page.

**Kind**: instance method of [<code>Confluence</code>](#Confluence)

| Param | Type |
| --- | --- |
| id | <code>string</code> |

<a name="Confluence+getAttachments"></a>

### confluence.getAttachments(space, id)
Get attachments

**Kind**: instance method of [<code>Confluence</code>](#Confluence)

| Param | Type |
| --- | --- |
| space | <code>string</code> |
| id | <code>string</code> |

<a name="Confluence+createAttachment"></a>

### confluence.createAttachment(space, id, filepath)
This allows you to post attachments to the pages you create.

**Kind**: instance method of [<code>Confluence</code>](#Confluence)

| Param | Type | Description |
| --- | --- | --- |
| space | <code>string</code> |  |
| id | <code>string</code> |  |
| filepath | <code>string</code> | absolute path of the file you are sending |

<a name="Confluence+updateAttachmentData"></a>

### confluence.updateAttachmentData(space, id, attachmentId, filepath)
This allows you to update posted attachments data

**Kind**: instance method of [<code>Confluence</code>](#Confluence)

| Param | Type |
| --- | --- |
| space | <code>string</code> |
| id | <code>string</code> |
| attachmentId | <code>string</code> |
| filepath | <code>string</code> |

<a name="Confluence+getLabels"></a>

### confluence.getLabels(id)
Get labels from content

**Kind**: instance method of [<code>Confluence</code>](#Confluence)

| Param | Type |
| --- | --- |
| id | <code>string</code> |

<a name="Confluence+postLabels"></a>

### confluence.postLabels(id, labels)
Post content labels to a existing page.

**Kind**: instance method of [<code>Confluence</code>](#Confluence)

| Param | Type |
| --- | --- |
| id | <code>string</code> |
| labels | <code>Array.&lt;{prefix:string, name:string}&gt;</code> |

<a name="Confluence+deleteLabel"></a>

### confluence.deleteLabel(id, label)
Delete a label from a page.

**Kind**: instance method of [<code>Confluence</code>](#Confluence)

| Param | Type |
| --- | --- |
| id | <code>string</code> |
| label | <code>string</code> |

<a name="Confluence+search"></a>

### confluence.search(query)
Search by query

**Kind**: instance method of [<code>Confluence</code>](#Confluence)

| Param | Type |
| --- | --- |
| query | <code>string</code> |

<a name="Confluence+getContentChildByContentId"></a>

### confluence.getContentChildByContentId(id, child_type)
See [doc](https://developer.atlassian.com/cloud/confluence/rest/api-group-content---children-and-descendants/#api-api-content-id-child-type-get)
Inspired from [haalcala](https://github.com/haalcala) based on his [PR](https://github.com/johnpduane/confluence-api/pull/25/commits/9a084dd397e69dfc941e585574ee426b28772da4)

**Kind**: instance method of [<code>Confluence</code>](#Confluence)

| Param | Type |
| --- | --- |
| id | <code>string</code> |
| child_type | <code>string</code> |

<a name="Confluence+getContentDescendantByContentId"></a>

### confluence.getContentDescendantByContentId(id, child_type)
See [doc](https://developer.atlassian.com/cloud/confluence/rest/api-group-content---children-and-descendants/#api-api-content-id-descendant-type-get)
Inspired from [haalcala](https://github.com/haalcala) based on his [PR](https://github.com/johnpduane/confluence-api/pull/25/commits/9a084dd397e69dfc941e585574ee426b28772da4)

**Kind**: instance method of [<code>Confluence</code>](#Confluence)

| Param | Type |
| --- | --- |
| id | <code>string</code> |
| child_type | <code>string</code> |

<a name="Confluence+getContentDescendantByContentId"></a>

### confluence.getPageAsPdf(id)
Inspired from [this](https://github.com/atlassian-api/atlassian-python-api/blob/f81391e2bf7313bf5e95e8293a6bae7beeb67669/atlassian/confluence.py#L1906)

Returns pdf buffer that can be:
- written with [fs.writeFile](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback)
- be handled with an another pdf library such as [pdf-lib](https://pdf-lib.js.org/)

**Kind**: instance method of [<code>Confluence</code>](#Confluence)

| Param | Type |
| --- | --- |
| id | <code>string</code> |

<a name="request"></a>

## request
Node.js wrapper for Atlassian's Confluence API.
See https://developer.atlassian.com/confdev/confluence-rest-api

Copyright (c) 2015, John Duane
Newly features have been implemented by [loopingz team](https://www.loopingz.com/who) freely inspired from [haalcala](https://github.com/haalcala) work and [atlassian-python-api](https://github.com/atlassian-api/atlassian-python-api) contributors work

Released under the MIT License
