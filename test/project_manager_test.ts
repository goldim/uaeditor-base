import * as _chai from 'chai';
import { expect } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { ProjectManager } from '../src/project_manager';

@suite class ProjectManagerTest {
  before() {
  }

  @test 'createEmptyProject' () {
    const manager = ProjectManager.Instance();

    manager.createEmptyProject();

    expect(manager.CurrentProject).to.not.be.null;
  }
}