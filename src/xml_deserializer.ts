import { XmlTags } from './xml_tags';
import { parse } from 'fast-xml-parser';
import { RecordSet } from './record_set';

export interface IDeserializer {
    parseUser(user: string): Generator<RecordSet>;
    parseProperty(property: string): Generator<RecordSet>;
    parseGroup(grp: string): Generator<RecordSet>;
    parseScript(script: string): Generator<RecordSet>;
    parseVariable(variable: string): Generator<RecordSet>;
    parseObject(obj: string): Generator<RecordSet>;
    parsePlugin(plugin: string): Generator<RecordSet>;
    parseBinding(content: string): Generator<RecordSet>;
    parseAlarm(content: string): Generator<RecordSet>;
    parseField(content: string): Generator<RecordSet>;

    parseBlock(content: string, tag: string): string;
}

export class ParseError extends Error {

}

export class XmlDeserializer implements IDeserializer
{
    private options: any;

    constructor(){
        this.options = {
            ignoreAttributes: false,
            attributeNamePrefix : '',
            parseNodeValue: false
        };
    }

    parseBlock(content: string, tag: string): string {
        const pattern = `<${tag}>(.*?)<\/${tag}>`;
        const regex = new RegExp(pattern);
        const res = regex.exec(content);
        if (res){
            return res[1];
        } else {
            throw new ParseError();
        }
    }

    *parseUser(str: string): Generator<RecordSet> {
        const res = this.parseOnlyTag(str, XmlTags.USERS);
        const getUser = (data: any) => {
            const res = new RecordSet();
            res.set("login", data.login);
            res.set("password", data.passwd);
            return res;
        };

        if (XmlTags.USER in res){
            yield getUser(res[XmlTags.USER]);
        }
        yield *this.parseWithoutContent(XmlTags.USER, res[XmlTags.USERS], getUser);
    }

    *parseProperty(str: string): Generator<RecordSet> {
        let res = this.parseOnlyTag(str, XmlTags.PROPERTIES);
        if (res){
            if (XmlTags.PROPERTIES in res){
                res = parse(res[XmlTags.PROPERTIES], this.options);
            }
            for (const name of Object.keys(res)){
                const resSet = new RecordSet();
                resSet.set('name', name);
                resSet.set('value', res[name].toString());
                yield resSet;
            }
        }
    }

    createRecordSet(e: any): RecordSet {
        const res = new RecordSet();
        res.set('id', e.id);
        res.set('content', e['#text']);
        return res;
    }

    *parseScript(str: string): Generator<RecordSet> {
        yield *this.parseWithoutContent(XmlTags.SCRIPT, str, e=>{
            const res = new RecordSet();
            res.set('path', e.path);
            res.set('content', e['#text']);
            return res;
        });
    }

    *parseVariable(str: string): Generator<RecordSet> {
        yield *this.parseWithoutContent(XmlTags.VARIABLE, str, e=>{ return this.createRecordSet(e); });
    }

    *parseObject(str: string): Generator<RecordSet> {
        yield *this.parseWithoutContent(XmlTags.OBJECT, str, e=>{ return this.createRecordSet(e); });
    }

    *parsePlugin(str: string): Generator<RecordSet> {
        yield *this.parseWithoutContent(XmlTags.PLUGIN, str, e=>{ return this.createRecordSet(e); });
    }

    *parseAlarm(str: string): Generator<RecordSet> {
        yield *this.parseWithoutContent(XmlTags.ALARM, str, e=>{ return this.createRecordSet(e); });
    }

    *parseField(content: string): Generator<RecordSet> {
        yield *this.parseWithoutContent(XmlTags.FIELD, content, e=>{ return this.createRecordSet(e); });
    }

    *parseGroup(grp: string): Generator<RecordSet> {
        while (true) {
            const firstBracket = grp.indexOf('<');
            if (firstBracket === -1) break;
            const name = grp.substring(firstBracket+1, grp.indexOf('>'));
            const pattern = `<${name}>([\\s\\S]*)</${name}>`;
            const regex = new RegExp(pattern);
            const res = regex.exec(grp);
            if (res) {
                grp = grp.replace(res[0], '');
                if (name === XmlTags.USERS){
                    continue;
                }
                const resSet = new RecordSet();
                resSet.set('name', name);
                resSet.set('content', res[1]);
                yield resSet;
            } else {
                throw new ParseError();
            }
        }
    }

    *parseBinding(str: string): Generator<RecordSet> {
        const f = (e: any) => {
            const res = new RecordSet();
            res.set('id', e.id);
            res.set('direction', e.direction);
            return res;
        };
        yield *this.parseWithoutContent(XmlTags.BINDTO, str, f);
    }

    private parseOnlyTag(str: string, tag: string): any {
        const extraOptions = Object.assign({}, this.options);
        extraOptions.stopNodes = [tag];
        return parse(str, extraOptions);
    }

    private *parseWithoutContent<T>(tag: string, str: string, f: (e:any)=>T): Generator<T> {
        const res = this.parseOnlyTag(str, tag);
        const elements = res[tag];

        if (elements){
            if (elements instanceof Array){
                for (const e of elements){
                    yield f(e);
                }
            } else {
                yield f(elements);
            }
        }
    }
}