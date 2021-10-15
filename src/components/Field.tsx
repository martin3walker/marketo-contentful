import React, {useState, useEffect} from 'react';
import { Dropdown, DropdownList, DropdownListItem, Flex, Paragraph, Pill, TextInput} from '@contentful/forma-36-react-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';

import styled from "styled-components";


interface FieldProps {
  sdk: FieldExtensionSDK;
}

// interface Parameters {
//   clientId: string;
//   munchkinId: string;
//   clientSecret: string;
// }

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
    console.log(searchTerm)
    if(forms) {
      const newDropdownData = [...forms].filter((item:FormObject) => {
        return item.name.toLowerCase().includes(searchTerm.toLocaleLowerCase())
      })
  
      console.log(newDropdownData)
      return newDropdownData;
    }

    return null;
  }

  useEffect (() => {
    //Get list of available forms to from Marketo selection
     (async () => {
       const response = await ( await fetch("http://localhost:9999/.netlify/functions/getMarketoData", {
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
      }
    })();

    // Set field value in local state
    const fieldValue = props.sdk.field.getValue()
    if(fieldValue !== undefined) {
      updateSelectedForm(fieldValue)
    }

  }, [props.sdk]) //Think about this

  return (
    <Flex flexDirection={"column"} fullHeight={true} style={{minHeight: 500}}>
      {props.sdk.field.getValue() && (
        <Flex flexDirection={"column"} marginBottom={"spacingL"}>
          <Paragraph style={{marginBottom: 10}}>
            Selected form
          </Paragraph>
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
                <DropdownList className={"dropdown-list"} maxHeight={500}>
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
  );
};

export default Field;