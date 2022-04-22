import * as _chai from 'chai';
import { expect, assert } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { Properties } from "../src/properties";
import { Builder } from '../src/builder';
import { XmlSerializer } from '../src/xml_serializer';
import { Loader } from '../src/loader';
import { XmlDeserializer } from '../src/xml_deserializer';
import { NullProperty } from '../src/null_property';

@suite class PropertiesTest {
    private props: Properties;

    before(){
        this.props = new Properties();
    }

    @test 'addProperty' (){
        this.props.addProperty("port", String(80));

        assert.isTrue(this.props.hasProperty("port"));
    }

    @test 'hasProperty no properties' (){
        assert.isFalse(this.props.hasProperty("port"));
    }

    @test 'getProperty no property' (){
        const prop = this.props.getProperty("port");

        expect(prop).to.be.instanceof(NullProperty);
    }

    @test 'getProperty' (){
        const NAME = "port";
        this.props.addProperty(NAME, String(80));

        const prop = this.props.getProperty(NAME);
        
        expect(prop.Name).to.be.equal(NAME);
    }

    @test 'save' (){
        this.props.addProperty('port', String(80));

        this.props.save();

        assert.isTrue(this.props.wasSaved());
    }

    @test 'load' (){
        const loader = new Loader('<options><port>8080</port><ip>localhost</ip></options>', new XmlDeserializer());

        this.props.load(loader);

        expect(this.props.getProperties()).to.have.length(2);
    }

    @test 'build' (){
        this.props.addProperty('port', String(80));
        const builder = new Builder(new XmlSerializer());

        this.props.build(builder);

        expect(builder.getResult()).to.be.equal("<options><port>80</port></options>");
    }
}
