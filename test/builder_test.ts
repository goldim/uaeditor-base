import * as _chai from 'chai';
import { expect, assert } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { Builder, IBuilder } from "../src/builder";
import { XmlSerializer } from '../src/xml_serializer';
import { Direction } from '../src/ibindable';

@suite class BuilderTest {
  private builder: IBuilder;

  before() {
      this.builder = new Builder(new XmlSerializer());
  }

  @test 'buildUser' (){
    const res = this.builder.buildUser('root', '1234');

    const expected = '<user login="root" passwd="1234"/>';
    expect(res.getResult()).to.be.equal(expected);
  }

  @test 'buildProperty' (){
    const res = this.builder.buildProperty('port', '1234');

    const expected = '<port>1234</port>';
    expect(res.getResult()).to.be.equal(expected);
  }

  @test 'starProperties' (){
    expect(this.builder.startProperties().getResult()).to.be.equal("<options>");
  }

  @test 'endProperties' (){
    expect(this.builder.endProperties().getResult()).to.be.equal("</options>");
  }

  @test 'startObject' (){
    expect(this.builder.startObject("obj1").getResult()).to.be.equal('<obj id="obj1">');
  }

  @test 'endObject' (){
    expect(this.builder.endObject().getResult()).to.be.equal('</obj>');
  }

  @test 'startGroup' (){
    expect(this.builder.startGroup('settings').getResult()).to.be.equal('<settings>');
  }

  @test 'endGroup' (){
    expect(this.builder.endGroup('settings').getResult()).to.be.equal('</settings>');
  }

  @test 'startUsers' (){
    expect(this.builder.startUsers().getResult()).to.be.equal('<users>');
  }

  @test 'endUsers' (){
    expect(this.builder.endUsers().getResult()).to.be.equal('</users>');
  }

  @test 'startVariable' (){
    expect(this.builder.startVariable('var1').getResult()).to.be.equal('<var id="var1">');
  }

  @test 'endVariable' (){
    expect(this.builder.endVariable().getResult()).to.be.equal('</var>');
  }

  @test 'buildBinding' (){
    expect(this.builder.buildBinding('var2', Direction.In).getResult()).to.be.equal('<bindTo id="var2" direction="in"/>');
  }

  @test 'startConfig' (){
    const expected = '<?xml version="1.0"?><project>';
    expect(this.builder.startConfig().getResult()).to.be.equal(expected);
  }

  @test 'endConfig' (){
    expect(this.builder.endConfig().getResult()).to.be.equal('</project>');
  }

  @test 'startConfigSection' (){
    expect(this.builder.startConfigSection('server').getResult()).to.be.equal('<server>');
  }

  @test 'endConfigSection' (){
    const testFunc = () => this.builder.endConfigSection();

    expect(testFunc).to.throw();
  }

  @test 'startScript' (){
    expect(this.builder.startScript('mod.lua').getResult()).to.be.equal('<script path="mod.lua">');
  }

  @test 'endScript' (){
    expect(this.builder.endScript().getResult()).to.be.equal('</script>');
  }
}