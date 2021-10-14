import React, { useCallback, useState, useEffect } from 'react';
import { AppExtensionSDK } from '@contentful/app-sdk';
import { Heading, Form, Workbench, Paragraph, TextField, TextFieldProps } from '@contentful/forma-36-react-components';
import { css } from 'emotion';

export interface AppInstallationParameters {
  clientId?: string;
  clientSecret?: string;
  munchkinId?: string;
  [key:string]: string | undefined;
}

interface ConfigProps {
  sdk: AppExtensionSDK;
}

const Config = (props: ConfigProps) => {
  const [parameters, setParameters] = useState<AppInstallationParameters>({});

  // Updates app configuration by calling this function as a callback in the app.sdk.onConfigure function
  const configureApp = useCallback(async () => {
    const currentState = await props.sdk.app.getCurrentState();
    return {
      parameters,
      targetState: currentState,
    };
  }, [parameters, props.sdk]);

  // Called whenever the config changes
  useEffect(() => {
    props.sdk.app.onConfigure(() => configureApp());
  }, [props.sdk, configureApp, parameters]);

  // Initial load for config page
  useEffect(() => {
    (async () => {
      const currentParameters: AppInstallationParameters | null = await props.sdk.app.getParameters();

      // Set local parameter state based on the installation params
      if (currentParameters) {
        setParameters(currentParameters);
      } else {
        setParameters({
          clientSecret: "",
          clientId: "",
          munchkinId: ""
        })
      }

      props.sdk.app.setReady();
    })()
  }, [props.sdk])

  const handleFieldChange:(
    event:React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => void = (event) => {
      const id  = event.target.id;
      const value = event.target.value;
      const newParameters:{[key:string]: any} = {
        ...parameters
      }
      newParameters[id] = value;
      setParameters(newParameters);
    }


  return (
    <Workbench className={css({ margin: '80px' })}>
      <Form>
        <Heading>App Config</Heading>
        <Paragraph>Welcome to your contentful app. This is your config page.</Paragraph>
        <TextField 
          required 
          name="clientId" 
          id="clientId" 
          labelText="Marketo Client ID" 
          onChange={(event) => handleFieldChange(event)} 
          value={parameters.clientId}
        />
        <TextField 
          required 
          name="clientSecret" 
          id="clientSecret" 
          labelText="Marketo Client Secret" 
          onChange={(event) => handleFieldChange(event)} 
          value={parameters.clientSecret}
        />
        <TextField 
          required 
          name="munchkinId" 
          id="munchkinId" 
          labelText="Marketo Munchkin Id" 
          onChange={(event) => handleFieldChange(event)} 
          value={parameters.munchkinId}
        />
      </Form>
    </Workbench>
  );
}

export default Config;
