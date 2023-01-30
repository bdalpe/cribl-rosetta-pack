const fs = require('fs');
const path = require('path');
const xpath = require('xpath');
const Dom = require('xmldom').DOMParser;

let events = []

const getAttributeValue = (element, attribute) => element.attributes.getNamedItem(attribute)?.value;

const contents = fs.readFileSync(path.join(__dirname, "security.xml"), 'utf16le')
var doc = new Dom().parseFromString(contents);
var select = xpath.useNamespaces({'events': 'http://schemas.microsoft.com/win/2004/08/events'})
var templates = select('//events:event', doc);
events = templates.map((e) => ({
    event_code: getAttributeValue(e, "value"),
    version: getAttributeValue(e, "version"),
    template: getAttributeValue(e, "message").value.replace(/\t/g, "\\t").replace(/\r\n/g, "\\n")
}));

const getTemplateDataFields = (tid, xpath, doc) => {
    let fields = xpath(`//events:template[@tid="${tid}"]/events:data/@name`, doc);
    return fields.map(e => e.nodeValue).join(',')
}

const contents2 = fs.readFileSync(path.join(__dirname, "Microsoft-Windows-Security-Auditing.manifest.xml"), 'utf8')
let doc2 = new Dom().parseFromString(contents2)
let e = select('//events:event', doc2)
e.forEach(elem => {
    let value = getAttributeValue(elem, "value");
    let version = getAttributeValue(elem, "version");
    let template = getAttributeValue(elem,"template");

    if (template) {
        let idx = events.findIndex(elem => elem.event_code === value && elem.version === version)
        Object.assign(events[idx], {fields: getTemplateDataFields(template, select, doc2)}, events[idx]);
    }
})


console.log("event_code,version,template,fields");
events.forEach(e => {
    console.log(`${e.event_code},${e.version},"${e.template}","${e.fields || ""}"`);
})
