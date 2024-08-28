"use client";

import { FormGroup, InputGroup, TextArea } from "@blueprintjs/core";
import React, { useCallback, useState } from "react";

const Form: React.FC = () => {
  const [exp, setExp] = useState<string>("");
  const handleExpChange = useCallback((e: any) => {
    setExp(e.currentTarget.value);
  }, []);

  return (
    <>
      <FormGroup>
        <p>expression</p>
        <TextArea fill onChange={handleExpChange}>
          {exp}
        </TextArea>
      </FormGroup>
    </>
  );
};

export default Form;
