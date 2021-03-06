import Layout from '../components/Layout'
import Link from 'next/link'
import Button from '@material-ui/core/Button';
import React, { useState} from "react";
import FormInputField from '../components/FormInputField'
import { useMutation } from "urql";
import gql from "graphql-tag";
import { useRouter } from 'next/router'

const SignUp = gql`
  mutation ($firstName: String!, $lastName: String!, $email: String!, $password: String!, $inviteCode: String!)  {
    signup(first_name: $firstName, last_name: $lastName, email: $email, password: $password, inviteCode: $inviteCode ) {
			id
    }
	}`;
	
const SignUpPage = () => {
	const router = useRouter()
	const [signUpResult, signUp] = useMutation(SignUp);
	const [formFields, setFormFields] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		inviteCode: ""
	})
	const [errorText, setErrorText] = useState("")

	const updateFormFields = (value, field) => {
		let newFormFields = Object.assign({}, formFields)
		newFormFields[field] = value
		setFormFields(newFormFields)
	}

	const handleSubmit = () => {
		signUp(formFields)
		.then(res => {
			if (res.error && res.error.message){
				const message = res.error.message
				if (message.includes("Invalid invite code")){
					setErrorText("Invalid Invite Code Please Try Another Code")
				} else if (message.includes("ique constraint failed on the fields: (`email")){
					setErrorText("That email has already been used")
				} else {
					setErrorText("An error has occured please try again later")
				}
			} else {
				router.push('/')
			}
		})
	}

  return(
		<Layout title="Signup | Goodcontent.ai">
			<div className='card-container'>
				<div className='card'>
					<h1>Sign Up</h1>
					<Link href="/login">
						<a>Already a user?</a>
					</Link>
					<FormInputField label={'First Name*'} value={formFields.firstName} 
						onChange={(e) => updateFormFields(e.target.value, 'firstName')}/>
					<FormInputField label={'Last Name*'} value={formFields.lastName} 
						onChange={(e) => updateFormFields(e.target.value, 'lastName')}/>
					<FormInputField label={'Email*'} value={formFields.email} 
						onChange={(e) => updateFormFields(e.target.value, 'email')}/>
					<FormInputField label={'Password*'} value={formFields.password} 
						onChange={(e) => updateFormFields(e.target.value, 'password')}/>
					<FormInputField label={'Invite Code*'} value={formFields.inviteCode} 
						onChange={(e) => updateFormFields(e.target.value, 'inviteCode')}/>
					<Button style={{minWidth: '120px', minHeight: "39px"}} onClick={handleSubmit} disableElevation variant="contained" color="primary">
						Sign Up
					</Button>
					<p style={{color: 'red', fontWeight: 'bold'}}>{errorText}</p>
				</div>
			</div>
  	</Layout>
	)
}

export default SignUpPage
