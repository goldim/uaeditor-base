import * as _chai from 'chai';
import { expect, assert } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { Project } from "../src/project";
import { ProjectFactory } from '../src/mock_impl/project_factory';

@suite class ProjectTest {
  private project: Project;

  before() {
    const content = '<project><server><users></users></server><plugins></plugins><opc></opc></project>'
    this.project = new Project(new ProjectFactory(content));
  }

  @test 'open' () {
    this.project.open();

    expect(this.project.isOpened()).to.be.true;
  }

  @test 'close opened this.project' (){
      this.project.open();
      this.project.close();

      expect(this.project.isOpened()).to.be.false;
  }

  @test 'close' (){
    this.project.close();

    expect(this.project.isOpened()).to.be.false;
  }

  @test 'save not modified' () {
    this.project.save();

    expect(this.project.wasSaved()).to.be.false;
  }

  @test 'isModified' (){
    assert.isFalse(this.project.isModified());
  }

  @test 'isModified save' (){
    this.project.save();

    assert.isFalse(this.project.isModified());
  }
}

@suite class ProjectIntegrationTest {
  @test 'load and save' (){
    const content = '<?xml version=\"1.0\"?><project><server><users><user login="root" passwd="1234"/></users></server><plugins></plugins><opc></opc></project>';
    const factory = new ProjectFactory(content);
    const proj = new Project(factory);
    proj.Path = "./";

    proj.open();
    proj.save();

    const saver: any = factory.getSaverFactory().getSaver();
    expect(saver.Content).to.be.equal(content);
  }
}