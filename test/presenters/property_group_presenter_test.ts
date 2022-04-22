import * as _chai from 'chai';
import { expect, assert } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { PropertyGroupPresenter } from "../../src/presenters/property_group_presenter";
import { Project } from '../../src/project';
import { ProjectFactory } from '../../src/mock_impl/project_factory';

@suite class PropertyGroupPresenterTest {
    private presenter: PropertyGroupPresenter;

    before(){
        this.presenter = new PropertyGroupPresenter();
        const groups = '<description><options><code>1111</code></options></description>';
        const content = `<project><server>${groups}<users></users></server><plugins></plugins><opc></opc></project>`;
        const proj = new Project(new ProjectFactory(content));
        proj.Path = "./"
        proj.open();
        this.presenter.Project = proj;
    }

    @test 'changeOptionValue non-existent property' (){
        const testFunc = () => this.presenter.changeOptionValue('description', 'uri', '1234');

        expect(testFunc).to.not.throw();
    }

    @test 'changeOptionValue' (){
        expect(this.presenter.getOptions('description')[0].value).to.be.equal('1111');

        this.presenter.changeOptionValue('description', 'code', '1234');

        expect(this.presenter.getOptions('description')[0].value).to.be.equal('1234');
    }
}
