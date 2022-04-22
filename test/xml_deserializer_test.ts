import * as _chai from 'chai';
import { expect, assert } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { IDeserializer, XmlDeserializer } from '../src/xml_deserializer';

@suite class XmlDeserializerTest {
    private deserializer: IDeserializer;

    before() {
        this.deserializer = new XmlDeserializer();
    }

    @test 'parseUser' (){
        const str = '<user login="root" passwd="1234"/>';

        const user = this.deserializer.parseUser(str).next().value;

        expect(user.get('login')).to.be.equal('root');
        expect(user.get('password')).to.be.equal('1234');
    }

    @test 'parseUsers no users' (){
        const str = '<users></users>';

        const users = this.deserializer.parseUser(str);

        assert.isTrue(users.next().done);
    }

    @test 'parseUsers 2 users' (){
        const str = '<users><user login="root" passwd="1234"/><user login="root2" passwd="1234"/></users>';

        const users = this.deserializer.parseUser(str);

        expect(users.next().value.get('login')).to.be.equal('root');
        expect(users.next().value.get('login')).to.be.equal('root2');
        assert.isTrue(users.next().done);
    }

    @test 'parseProperty' (){
        const str = '<port>8080</port>';

        const prop = this.deserializer.parseProperty(str).next().value;

        expect(prop.get('name')).to.be.equal('port');
        expect(prop.get('value')).to.be.equal('8080');
    }

    @test 'parseProperties 2 props' (){
        const str = '<ip>localhost</ip><port>8080</port>';

        const props = this.deserializer.parseProperty(str);

        expect(props.next().value.get('name')).to.be.equal('ip');
        expect(props.next().value.get('name')).to.be.equal('port');
        assert.isTrue(props.next().done);
    }

    @test 'parseVariable no vars' (){
        const str = '';

        const props = this.deserializer.parseVariable(str);

        assert.isTrue(props.next().done);
    }

    @test 'parseVariable 2 vars' (){
        const str = '<var id="ip"></var><var id="port"></var>';

        const vars = this.deserializer.parseVariable(str);

        expect(vars.next().value.get('id')).to.be.equal('ip');
        expect(vars.next().value.get('id')).to.be.equal('port');
        assert.isTrue(vars.next().done);
    }

    @test 'parseObject no objects' (){
        const str = '';

        const objs = this.deserializer.parseObject(str);

        assert.isTrue(objs.next().done);
    }

    @test 'parseObject 2 adjacent objects' (){
        const str = '<obj id="ip"><value>localhost</value></obj><obj id="port"></obj>';

        const objs = this.deserializer.parseObject(str);

        expect(objs.next().value.get('id')).to.be.equal('ip');
        expect(objs.next().value.get('id')).to.be.equal('port');
        assert.isTrue(objs.next().done);
    }

    @test 'parseObject object inside object' (){
        const str = '<obj id="connection"><obj id="port"></obj></obj>';

        const objs = this.deserializer.parseObject(str);

        const obj = objs.next().value;
        expect(obj.get('id')).to.be.equal('connection');
        expect(obj.get('content')).to.be.equal('<obj id="port"></obj>');
    }

    @test 'parseProperties no props' (){
        const str = '';

        const props = this.deserializer.parseProperty(str);

        assert.isTrue(props.next().done);
    }

    @test 'parseGroup' (){
        const str = '<description><port>8080</port></description>';

        const grp = this.deserializer.parseGroup(str).next().value;

        expect(grp.get('name')).to.be.equal('description');
        expect(grp.get('content')).to.be.equal('<port>8080</port>');
    }

    @test 'parseGroups' (){
        const str = '<description><port>8080</port></description><settings><ip>localhost</ip></settings>';

        const grps = this.deserializer.parseGroup(str);

        expect(grps.next().value.get('name')).to.be.equal('description');
        expect(grps.next().value.get('name')).to.be.equal('settings');
        assert.isTrue(grps.next().done);
    }

    @test 'parseScript no scripts' (){
        const str = '';

        const scripts = this.deserializer.parseScript(str);

        assert.isTrue(scripts.next().done);
    }

    @test 'parseScript 2 adjacent scripts' (){
        const str = '<script path="home"></script><script path="var"></script>';

        const scripts = this.deserializer.parseScript(str);

        expect(scripts.next().value.get('path')).to.be.equal('home');
        expect(scripts.next().value.get('path')).to.be.equal('var');
        assert.isTrue(scripts.next().done);
    }

    @test 'parseBinding no bindings' (){
        const str = '';

        const bindings = this.deserializer.parseBinding(str);

        assert.isTrue(bindings.next().done);
    }

    @test 'parseBinding 2 adjacent bindings' (){
        const str = '<bindTo id="var1"/><bindTo id="var2"/>';

        const bindings = this.deserializer.parseBinding(str);

        expect(bindings.next().value.get('id')).to.be.equal('var1');
        expect(bindings.next().value.get('id')).to.be.equal('var2');
        assert.isTrue(bindings.next().done);
    }

    @test 'parsePlugin no plugins' (){
        const str = '';

        const plugins = this.deserializer.parsePlugin(str);

        assert.isTrue(plugins.next().done);
    }

    @test 'parsePlugin 2 adjacent plugins' (){
        const str = '<plugin id="plugin1"><options></options></plugin><plugin id="plugin2"><options></options></plugin>';

        const plugins = this.deserializer.parsePlugin(str);

        expect(plugins.next().value.get('id')).to.be.equal('plugin1');
        expect(plugins.next().value.get('id')).to.be.equal('plugin2');
        assert.isTrue(plugins.next().done);
    }

    @test 'parseAlarm no alarms' (){
        const str = '';

        const alarms = this.deserializer.parseAlarm(str);

        assert.isTrue(alarms.next().done);
    }

    @test 'parseAlarm 2 alarms' (){
        const str = '<alarm id="alarm1"></alarm><alarm id="alarm2"></alarm>';

        const alarms = this.deserializer.parseAlarm(str);

        expect(alarms.next().value.get('id')).to.be.equal('alarm1');
        expect(alarms.next().value.get('id')).to.be.equal('alarm2');
        assert.isTrue(alarms.next().done);
    }
}