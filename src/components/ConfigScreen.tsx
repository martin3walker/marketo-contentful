import React, { useCallback, useState, useEffect } from 'react';
import { AppExtensionSDK } from '@contentful/app-sdk';
import { Button, Heading, HelpText, Form, FieldGroup, Flex, Workbench, Paragraph, TextField, TextLink, Notification } from '@contentful/forma-36-react-components';
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
  const [parameters, setParameters] = useState<AppInstallationParameters>(
    {
      clientId: "", 
      clientSecret: "", 
      munchkinId: ""
    }
  );
  const [loading, setLoadingStatus] = useState(false);

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

    const testConnection:() => void = async () => {
      try {
        setLoadingStatus(true);
        const response = await fetch(`${process.env.REACT_APP_ENDPOINT || "https://marketo-app.netlify.app"}/.netlify/functions/getMarketoData`, {
          method: "POST",
          body: JSON.stringify(parameters),
          headers: {
            "Access-Control-Request-Method": "POST",
            "Content-Type": "application/json"
          }
        })
        if (response.status === 200) {
          Notification.success("Your connection to the Marketo API is working.")
        } else {
          const body = await response.json();
          Notification.error(body.message)
        }
        setLoadingStatus(false)
      } catch(error) {
        Notification.error("Check console for errors.");
        console.log(error);
      }
    }

  return (
    <>
      <Workbench className={css({ margin: '30px 80px 0px' })}>
        <Flex fullWidth justifyContent="center">
          <Form>
            <Heading>Marketo App Configuration</Heading>
            <Paragraph>
              Please configure your application with the following credentials. Press "Save" in the top right corner when you have finished.
            </Paragraph>
            <FieldGroup>
              <TextField 
                required 
                name="clientId" 
                id="clientId" 
                labelText="Marketo Client ID" 
                onChange={(event) => handleFieldChange(event)} 
                value={parameters.clientId}
              />
              <TextLink
                href="https://developers.marketo.com/rest-api/authentication/#creating_an_access_token" 
                target="_blank" 
                rel="noreferrer">
                  How to find your Client ID
              </TextLink>
            </FieldGroup>
            <FieldGroup>
              <TextField 
                required 
                name="clientSecret" 
                id="clientSecret" 
                labelText="Marketo Client Secret" 
                onChange={(event) => handleFieldChange(event)} 
                value={parameters.clientSecret}
              />
              <TextLink
                href="https://developers.marketo.com/rest-api/authentication/#creating_an_access_token" 
                target="_blank" 
                rel="noreferrer">
                  How to find your Client Secret
              </TextLink>
            </FieldGroup>
            <FieldGroup>
              <TextField 
                required 
                name="munchkinId" 
                id="munchkinId" 
                labelText="Marketo Munchkin Id" 
                onChange={(event) => handleFieldChange(event)} 
                value={parameters.munchkinId}
              />
              <TextLink
                href="https://nation.marketo.com/t5/knowledgebase/how-to-find-your-munchkin-id-for-a-marketo-instance/ta-p/248432" 
                target="_blank" 
                rel="noreferrer">
                  How to find your Munchkin ID
              </TextLink>
              <HelpText>
                It is also the first part of the rest/identity endpoints as described <TextLink
                href="https://developers.marketo.com/rest-api/authentication/#creating_an_access_token" 
                target="_blank" 
                rel="noreferrer">
                  here
              </TextLink>.
              <br/>
              For instance, for the url 'https://064-CCJ-768.mktorest.com/idenity', '064-CCJ-768' would be the munchkin id.
              </HelpText>
            </FieldGroup>
            <Button
              onClick={() => testConnection()}
              loading={loading}
            >
              Test marketo connection
            </Button>
          </Form>
        </Flex>
      </Workbench>
    </>
  );
}

export default Config;
