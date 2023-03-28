const fs = require('fs');
const path = require('path');
const xpath = require('xpath');
const Dom = require('xmldom').DOMParser;
const createCsvWriter = require('csv-writer').createArrayCsvWriter;

let pathToManifests = path.join(__dirname, "source");
let pathToCustomManifests = path.join(__dirname, "custom_manifests");

const getNodeValue = (node, element) => xpath.select(`${node}/text()`, element)[0]?.nodeValue.trimStart();

const processTemplate = (xmlString) => {
    if (!xmlString) return "";
    const select = xpath.useNamespaces({'events': 'http://schemas.microsoft.com/win/2004/08/events'});
    let template = new Dom().parseFromString(xmlString);
    let names = select("/events:template/events:data/@name", template);
    return names.map(e => e.nodeValue).join(',');
}
const processEvent = (event) => {
    let eventCode = getNodeValue("Id", event);
    let version = getNodeValue("Version", event);
    let message = getNodeValue("Message", event)?.replace(/\t/g, "\\t").replace(/\r/g, "\\r").replace(/\n/g, "\\n");
    let template = getNodeValue("Template", event);
    return [eventCode, version, message, processTemplate(template)];
}

const csv = createCsvWriter({
    header: ['provider', 'event_code', 'version', 'template', 'fields'],
    path: './templates.csv'
})
const processManifestContents = (contents) => {
    let doc = new Dom().parseFromString(contents);
    let templates = xpath.select('/Providers/Provider/EventMetadata/Event', doc);
    let provider = getNodeValue('/Providers/Provider/Name', doc);
    return {provider, templates: templates.map(template => processEvent(template))};
}

let out = [];
const exclude = ['.gitkeep', 'All.xml'];
const handleDir = (p) => fs.readdirSync(p).flat().filter(file => !exclude.includes(file)).forEach(file => {
    console.log(`Processing ${file}`);
    let f = fs.readFileSync(path.join(p, file), 'utf8');
    let records = processManifestContents(f);
    let output = records.templates.map(entry => [records.provider, ...entry]);
    out.push(...output);
});

[pathToManifests, pathToCustomManifests].forEach(entry => handleDir(entry));

csv.writeRecords(out).then(() => console.log("done"));
