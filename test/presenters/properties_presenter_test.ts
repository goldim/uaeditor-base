import * as _chai from 'chai';
import { expect, assert } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { PropertiesPresenter } from "../../src/presenters/properties_presenter";
import { Project } from '../../src/project';
import { ProjectFactory } from '../../src/mock_impl/project_factory';

@suite class PropertiesPresenterTest {
    private presenter: PropertiesPresenter;

    before(){
        this.presenter = new PropertiesPresenter();
        this.presenter.Project = new Project(new ProjectFactory());
    }

    @test 'getProperties non existent id' (){
        const props = this.presenter.getProperties('testObject');

        expect(props).to.be.empty;
    }
}
