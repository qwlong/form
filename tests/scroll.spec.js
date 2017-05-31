/* eslint-disable no-undef, react/prop-types */
jest.mock('dom-scroll-into-view', () => jest.fn());

import React from 'react';
import scrollIntoView from 'dom-scroll-into-view';
import { mount } from 'enzyme';
import createDOMForm from '../src/createDOMForm';

class Test extends React.Component {
  render() {
    const { form, name } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div>
        {getFieldDecorator(name, {
          rules: [{
            required: true,
          }],
        })(<textarea style={{ overflowY: 'auto' }} />)}
      </div>
    );
  }
}

Test = createDOMForm({
  withRef: true,
})(Test);

describe('validateFieldsAndScroll', () => {
  beforeEach(() => {
    scrollIntoView.mockClear();
  });
  it('works on overflowY auto element', (done) => {
    const wrapper = mount(<Test name="normal" />, { attachTo: document.body });
    const form = wrapper.ref('wrappedComponent').prop('form');
    form.validateFieldsAndScroll(() => {
      expect(scrollIntoView.mock.calls[0][1].tagName).not.toBe('TEXTAREA');
      wrapper.detach();
      done();
    });
  });

  it('works with nested fields', (done) => {
    const wrapper = mount(<Test name="a.b.c" />, { attachTo: document.body });
    const form = wrapper.ref('wrappedComponent').prop('form');
    form.validateFieldsAndScroll(() => {
      expect(scrollIntoView).toHaveBeenCalled();
      wrapper.detach();
      done();
    });
  });
});
