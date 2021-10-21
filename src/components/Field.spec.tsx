import React from 'react';
import Field from './Field';
import  { init, FieldExtensionSDK } from '@contentful/app-sdk';
import { render } from '@testing-library/react';

init (sdk => {
  describe('Field component', () => {
    it('Component text exists', () => {
      const { getByText } = render(<Field sdk={sdk as FieldExtensionSDK}/>);
      expect(getByText('Hello Entry Field Component')).toBeInTheDocument();
    });
  });
})
