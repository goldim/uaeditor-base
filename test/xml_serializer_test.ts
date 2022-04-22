import * as _chai from 'chai';
import { expect, assert } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { ISerializer, XmlSerializer } from '../src/xml_serializer';

@suite class XmlSerializerTest {
    private serializer: ISerializer;

    before() {
        this.serializer = new XmlSerializer();
    }

    @test 'serializeUser' (){
      const res = this.serializer.serializeUser('root', '1234');

      const expected = '<user login="root" passwd="1234"/>';
      expect(res).to.be.equal(expected);
    }

    @test 'serializeProperty' (){
      const res = this.serializer.serializeProperty('port', '1234');

      const expected = '<port>1234</port>';
      expect(res).to.be.equal(expected);
    }

    @test 'starProperties' (){
      expect(this.serializer.startProperties()).to.be.equal("<options>");
    }

    @test 'endProperties' (){
      expect(this.serializer.endProperties()).to.be.equal("</options>");
    }

    @test 'startObject' (){
      expect(this.serializer.startObject("obj1")).to.be.equal('<obj id="obj1">');
    }

    @test 'endObject' (){
      expect(this.serializer.endObject()).to.be.equal('</obj>');
    }

    @test 'startGroup' (){
      expect(this.serializer.startGroup('settings')).to.be.equal('<settings>');
    }

    @test 'endGroup' (){
      expect(this.serializer.endGroup('settings')).to.be.equal('</settings>');
    }

    @test 'startUsers' (){
      expect(this.serializer.startUsers()).to.be.equal('<users>');
    }

    @test 'endUsers' (){
      expect(this.serializer.endUsers()).to.be.equal('</users>');
    }

    @test 'startVariable' (){
      expect(this.serializer.startVariable('var1')).to.be.equal('<var id="var1">');
    }

    @test 'endVariable' (){
      expect(this.serializer.endVariable()).to.be.equal('</var>');
    }

    @test 'serializeBinding' (){
      expect(this.serializer.serializeBinding('var2')).to.be.equal('<bindTo id="var2" direction="in"/>');
    }

    @test 'startConfig' (){
      const expected = '<?xml version="1.0"?><project>';
      expect(this.serializer.startConfig()).to.be.equal(expected);
    }

    @test 'endConfig' (){
      expect(this.serializer.endConfig()).to.be.equal('</project>');
    }

    @test 'startConfigSection' (){
      expect(this.serializer.startConfigSection('server')).to.be.equal('<server>');
    }

    @test 'endConfigSection' (){
      expect(this.serializer.endConfigSection('server')).to.be.equal('</server>');
    }

    @test 'startScript' (){
      expect(this.serializer.startScript('mod.lua')).to.be.equal('<script path="mod.lua">');
    }

    @test 'endScript' (){
      expect(this.serializer.endScript()).to.be.equal('</script>');
    }

    @test 'startAlarm' (){
      expect(this.serializer.startAlarm('alarm1')).to.be.equal('<alarm id="alarm1">');
    }

    @test 'endAlarm' (){
      expect(this.serializer.endAlarm()).to.be.equal('</alarm>');
    }

    @test 'startField' (){
      expect(this.serializer.startField('field1')).to.be.equal('<field id="field1">');
    }

    @test 'endField' (){
      expect(this.serializer.endField()).to.be.equal('</field>');
    }
  }