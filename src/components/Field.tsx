import React, {useState, useEffect} from 'react';
import { Dropdown, DropdownList, DropdownListItem, Select, Option,Flex, Paragraph, Pill, TextInput, Spinner} from '@contentful/forma-36-react-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';

import styled from "styled-components";


interface FieldProps {
  sdk: FieldExtensionSDK;
}

interface FormObject {
  name: string;
  id: string;
}

const StyledDropdownContainer = styled.div`
  width: 100%;
  > .dropdown {
    width: 100%;
    padding: 10px;
  }
`


const Field = (props: FieldProps) => {
  const [forms, updateForms] = useState<FormObject[] | null>(null);
  const [selectedForm, updateSelectedForm] = useState<FormObject | null>(null);
  const [dropdownForms, updateDropdownForms] = useState<FormObject[] | null>(null);
  const [loadingData, updateLoadingStatus] = useState(true);

  props.sdk.window.startAutoResizer()

  const updateFieldValue = (item:FormObject) => {
    if (item.id === selectedForm?.id) {
      props.sdk.field.setValue(null);
      updateSelectedForm(null);
      return;
    }
    props.sdk.field.setValue(item);
    updateSelectedForm(item);
  }

  const getDropdownData = (searchTerm:string) => {
    if(forms) {
      const newDropdownData = [...forms].filter((item:FormObject) => {
        return item.name.toLowerCase().includes(searchTerm.toLocaleLowerCase())
      })
  
      return newDropdownData;
    }

    return null;
  }

  useEffect (() => {
    //Get list of available forms to from Marketo selection
     (async () => {
        try {
          const response = await ( await fetch(`${process.env.REACT_APP_ENDPOINT || "https://marketo-app.netlify.app"}/.netlify/functions/getMarketoData`, {
            method: "POST",
            body: JSON.stringify(props.sdk.parameters.installation),
            headers: {
              "Access-Control-Request-Method": "POST",
              "Content-Type": "application/json"
            }
          })).json()
  
          if(response.result) {
            updateForms(response.result); 
            updateDropdownForms(response.result);
            updateLoadingStatus(false);
          }
        }
        catch (error) {
          console.log(error)
        }
    })();

    // Set field value in local state
    const fieldValue = props.sdk.field.getValue()
    if(fieldValue !== undefined) {
      updateSelectedForm(fieldValue)
    }

  }, [props.sdk]) //Think about this

  return (
    <>
      {loadingData ? (
        <Paragraph>
          Loading Marketo data <Spinner color={"primary"}/>
        </Paragraph>
      ):
      (
        <Flex flexDirection={"column"} fullHeight={true} style={{minHeight: 500}}>
          {props.sdk.field.getValue() && (
            <Flex flexDirection={"column"} marginBottom={"spacingL"}>
              <Flex flexWrap={"wrap"}>
                {selectedForm && (
                  <Pill  
                    label={selectedForm.name} 
                    onClose={() => updateFieldValue(selectedForm)} 
                    key={selectedForm.id}
                  />
                )}
              </Flex>
            </Flex>
          )}

          {dropdownForms && dropdownForms.length > 0 ? (
            <>
              <Flex marginBottom={'spacingS'}>
                <TextInput 
                  onChange={(event) => updateDropdownForms(getDropdownData(event.target.value))} placeholder="Search for a form"
                />
              </Flex>
              <Flex>
                <StyledDropdownContainer>
                  <Dropdown
                    isOpen={true}
                    dropdownContainerClassName={"dropdown"}
                  >
                    <DropdownList className={"dropdown-list"}>
                      {dropdownForms.map((item) => (
                        <DropdownListItem 
                          onClick={() => updateFieldValue(item)} 
                          isActive={selectedForm ? selectedForm.id === item.id : false} 
                          key={`key-${item.id}`}
                        >
                          {item.name}
                        </DropdownListItem>
                      ))}
                    </DropdownList>
                  </Dropdown>
                </StyledDropdownContainer>
              </Flex>
            </>
          ):(
            <Paragraph>Try expanding your search</Paragraph>
          )}
        </Flex>
      )}
    </>
  );
};

export default Field;