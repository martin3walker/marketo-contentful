import React, {useState, useEffect} from 'react';
import { Paragraph } from '@contentful/forma-36-react-components';
import { FieldExtensionSDK, AppExtensionSDK } from '@contentful/app-sdk';

interface FieldProps {
  sdk: FieldExtensionSDK;
}

interface Parameters {
  clientId: string;
  munchkinId: string;
  clientSecret: string;
}

interface FormObject {
  title: string;
  id: string;
}


const Field = (props: FieldProps) => {
  // const [formsArray, updateFormsArray] = useState<FormObject[] | null>(null);

  // useEffect (() => {
  //   //Get form data from function
  //    (async () => {
  //      const res = fetch("http://localhost:9999/.netlify/functions/getMarketoData", {
  //        method: "POST",
  //        body: JSON.stringify(props.sdk.parameters.installation),
  //        headers: {
  //          'Access-Control-Allow-Origin': '*',
  //          'Content-Type': 'application/json'
  //        }
  //      })
  //      console.log(res)
  //     // const formData:FormObject[] = await (await fetch('https://www.contentful.com/.netlify/functions/getMarketoFormIds')).json()

  //     // if(formData) {
  //     //   updateFormsArray(formData) 
  //     // }
  //   })();
  // }, [])

  // // useEffect(() => {
  // //   (async () => {
  // //     const { clientId, clientSecret, munchkinId }:any = props.sdk.parameters.installation
  // //     console.log(props.sdk.parameters)
  // //     // const res = requestHandler(clientId, clientSecret, munchkinId)
  // //     // console.log(res)
  // //   })();
  // // }, [props.sdk.parameters.installation])


  // // If you only want to extend Contentful's default editing experience
  // // reuse Contentful's editor components
  // // -> https://www.contentful.com/developers/docs/extensibility/field-editors/
  return <Paragraph>Hello Entry Field Component</Paragraph>;
};

export default Field;
