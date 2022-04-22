import * as _chai from 'chai';
import { expect, assert } from 'chai';
import { suite, test } from '@testdeck/mocha';
import { Script } from '../src/script';
import { Builder } from '../src/builder';
import { XmlSerializer } from '../src/xml_serializer';
import { Loader } from '../src/loader';
import { XmlDeserializer } from '../src/xml_deserializer';
import { OpcVariable } from '../src/opc_variable';

@suite class ScriptTest {
  private script: Script;

  before(){
    this.script = new Script();
  }

  @test 'set Content' (){
    this.script.Content = 'var1 = 1;';

    expect(this.script.Content).to.be.equal('var1 = 1;');
    assert.isTrue(this.script.isModified());
  }

  @test 'save' (){
    this.script.save();

    assert.isFalse(this.script.isModified());
    assert.isTrue(this.script.wasSaved());
  }

  @test 'save change property value' (){
    this.script.addProperty('port', '80');
    this.script.save();

    const prop = this.script.getProperty('port');
    prop.Value = '8080';
    this.script.save();

    assert.isTrue(this.script.wasSaved());
  }

  @test 'save change variable' (){
    this.script.addProperty('port', '80');
    const var1 = new OpcVariable('var1');
    this.script.add(var1);
    this.script.save();

    var1.Id = 'var2';
    this.script.save();

    assert.isTrue(this.script.wasSaved());
  }

  @test 'isModified' () {
    assert.isFalse(this.script.isModified());
  }

  @test 'isModified change variable' (){
    const var1 = new OpcVariable('var1');
    this.script.add(var1);
    this.script.save();

    var1.Id = 'var2';

    assert.isTrue(this.script.isModified());
  }

  @test 'hasProperty no property' (){
    assert.isFalse(this.script.hasProperty("ip"));
  }

  @test 'addProperty' (){
    this.script.addProperty('port', '80');

    assert.isTrue(this.script.hasProperty('port'));
  }

  @test 'build' (){
    this.script.addProperty('freq', '50');
    const builder = new Builder(new XmlSerializer());

    this.script.build(builder)

    const expected = '<script path=""><options><freq>50</freq></options></script>';
    expect(builder.getResult()).to.be.equal(expected);
  }

  @test 'load' (){
    const options = '<options><port>8080</port></options>';
    const vars = '<var id="var1"><options></options></var>';
    const content = `<script path="./">${options}${vars}</script>`;
    const loader = new Loader(content, new XmlDeserializer());

    this.script.load(loader);

    assert.isFalse(this.script.isModified());
    expect(this.script.Path).to.be.equal('./');
    expect(this.script.getProperty('port').Value).to.be.equal('8080');
    expect(this.script.getInVars()).has.to.include.members(['var1']);
  }

  @test 'add variable' (){
    const var1 = new OpcVariable('var1');

    this.script.add(var1);

    assert.isTrue(this.script.isModified());
    assert.isTrue(this.script.hasChild('var1'));
  }

  @test 'remove variable' (){
    const var1 = new OpcVariable('var1');
    this.script.add(var1);
    this.script.save();

    this.script.remove('var1');

    assert.isTrue(this.script.isModified());
    assert.isFalse(this.script.hasChild('var1'));
  }

  @test 'toString method' (){
    expect(this.script.toString()).to.be.equal('script');
  }
}
