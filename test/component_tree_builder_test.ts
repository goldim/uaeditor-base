import * as _chai from 'chai';
import { expect, assert } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { ComponentTreeBuilder } from "../src/component_tree_builder";
import { Config } from '../src/config';
import { XmlDeserializer } from '../src/xml_deserializer';
import { Loader } from '../src/loader';

@suite class ComponentTreeTest {
  private builder: ComponentTreeBuilder;
  private cfg: Config;

  private usersSection = '<users></users>';
  private opcSection = '<opc></opc>';
  private pluginSection = '<plugins></plugins>';
  private deviceSection: string;

  before() {
      this.builder = new ComponentTreeBuilder();
      this.cfg = new Config();
  }

  @test 'makeTree empty cfg' (){
    const res = this.builder.makeTree(this.cfg);

    const expected = {
      id: 'root',
      type: 'folder',
      children: [
        {
          id: 'objects',
          type: 'opcobj',
          children: []
        },
        {
          id: 'devices',
          type: 'device',
          children: []
        },
        {
          id: 'plugins',
          type: 'plugin',
          children: []
        }
      ]
    }
    expect(res).to.deep.equal(expected);
  }

  @test 'makeObjectTree' (){
    const opc = '<opc><obj id="obj1"><options></options><obj id="obj2"><options></options></obj><var id="var2"><options></options></var></obj><var id="var1"><options></options></var></opc>';
    const content = `<?xml version=\"1.0\"?><project><server>${this.usersSection}</server>${this.pluginSection}${opc}</project>`;
    const loader = new Loader(content, new XmlDeserializer());
    this.cfg.load(loader);

    const res = this.builder.makeObjectTree(this.cfg);

    const expected = {
        id: 'objects',
        type: 'opcobj',
        children: [
          {
            id: 'obj1',
            type: "opcobj",
            children: [
              {
                id: 'obj2',
                children: [],
                type: 'opcobj'
              },
              {
                id: 'var2',
                children: [],
                type: 'opcvar'
              }
            ]
          },
          {
            id: 'var1',
            type: 'opcvar',
            children: []
          }
        ]
    };
    expect(res).to.deep.equal(expected);
  }

  @test 'makePluginTree' (){
    const plugins = '<plugins><plugin id="plugin1"><options></options></plugin><plugin id="plugin2"><options></options></plugin></plugins>';
    const content = `<?xml version=\"1.0\"?><project><server>${this.usersSection}</server>${plugins}${this.opcSection}</project>`;
    const loader = new Loader(content, new XmlDeserializer());
    this.cfg.load(loader);

    const res = this.builder.makePluginTree(this.cfg);

    const expected = {
        id: 'plugins',
        type: 'plugin',
        children: [
          {
            id: 'plugin1',
            type: 'plugin',
            children: []
          },
          {
            id: 'plugin2',
            type: 'plugin',
            children: []
          }
        ]
    };
    expect(res).to.deep.equal(expected);
  }
}