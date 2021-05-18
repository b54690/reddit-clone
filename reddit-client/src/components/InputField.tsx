import React, { InputHTMLAttributes } from 'react';
import { useField } from 'formik';
import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string;
    label: string;
}
// Destructure a prop using '_' i.e. remove the props from the props variable
const InputField: React.FC<InputFieldProps> = ({
    size: _,
    label,
    ...props
}) => {
    const [field, {error}] = useField(props);
    return (
    // using !! on a string e.g error, casts the empty string as a boolean
    // '' => false
    // 'error message' => true
    <FormControl isInvalid={!!error}>
        <FormLabel htmlFor={field.name}>{label}</FormLabel>
        <Input {...field} {...props} id={field.name} />
        {error ? <FormErrorMessage>{error}</FormErrorMessage>: null}
    </FormControl>
    )
}  

export default InputField;   