import * as _chai from 'chai';
import { expect, assert } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { Type } from "../src/type";

@suite class TypeTest {
  private t: Type;

  before(){
    this.t = new Type('opcobj');
  }

  @test 'construct' () {
    expect(this.t.Name).to.be.equal('opcobj');
    expect(this.t.getChildTypes()).to.have.lengthOf(0);
    expect(this.t.getOptions()).to.have.lengthOf(0);
  }

  @test 'add Type' () {
    const subType = new Type('opcvar');

    this.t.addChildType(subType);
    
    expect(this.t.getChildTypeNames()).to.include.members(['opcvar']);
  }

  @test 'add Option' () {
    this.t.addOption('port');
    
    expect(this.t.getOptions()).to.include.members(['port']);
  }
}