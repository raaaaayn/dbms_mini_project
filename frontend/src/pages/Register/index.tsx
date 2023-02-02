import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { Button, Checkbox, FormControlLabel } from '@mui/material';
import TextField from '@mui/material/TextField';

import register from '@/services/register';
import username_exists from '@/services/username_exists';

import './style.css';

const RegisterPage = () => {
	const [username, set_username] = useState('');
	const [name, set_name] = useState('');
	const [dob, set_dob] = useState('');
	const [email, set_email] = useState('');
	const [password, set_password] = useState('');
	const [profile_pic, set_profile_pic] = useState<string | null>(null);
	const [private_account, set_private_account] = useState(false);
	const [to_fetch_userexists, set_to_fetch_userexists] = useState(false);

	const navigate = useNavigate();

	const { data: userexists, refetch } = useQuery('userexists', () => username_exists(username), {
		enabled: to_fetch_userexists,
		retry: false,
		refetchOnWindowFocus: false,
	});

	const register_user = useMutation(register);

	const [registration_step, set_registration_step] = useState(0);

	useEffect(() => {
		console.log('useeffect');
		console.log(userexists);
		if (userexists === false) set_registration_step(1);
	}, [to_fetch_userexists]);

	const registration_step_forms = [
		<form
			onSubmit={(e) => {
				e.preventDefault();
				refetch().then(() => {
					set_to_fetch_userexists(!to_fetch_userexists);
				});
			}}
			className="login-form"
		>
			<TextField
				className="user-inputs"
				required
				label="username"
				value={username}
				error={userexists}
				onChange={(e) => {
					set_username(e.target.value);
				}}
			/>
			<p className="error-field">{userexists === true ? 'Username already taken' : null}</p>
			<TextField
				className="user-inputs"
				required
				label="Password"
				type="password"
				value={password}
				onChange={(e) => {
					set_password(e.target.value);
				}}
			/>
			<Button type="submit">Next</Button>
		</form>,
		<form
			onSubmit={(e) => {
				if (!register_user.isLoading) {
					console.log('preventing default');
					e.preventDefault();
					register_user.mutate(
						{ username, name, email, dob, password, account_type: private_account, profile_pic },
						{
							onSuccess: () => {
								navigate('/');
							},
						},
					);
				}
			}}
			className="login-form"
		>
			<TextField
				className="user-inputs"
				required
				disabled={register_user.isLoading}
				label="name"
				value={name}
				error={userexists}
				onChange={(e) => {
					set_name(e.target.value);
				}}
			/>
			<TextField
				className="user-inputs"
				required
				disabled={register_user.isLoading}
				label="email"
				value={email}
				onChange={(e) => {
					set_email(e.target.value);
				}}
			/>
			<TextField
				className="user-inputs"
				required
				disabled={register_user.isLoading}
				label="dob"
				value={dob}
				onChange={(e) => {
					set_dob(e.target.value);
				}}
			/>
			<TextField
				className="user-inputs"
				disabled={register_user.isLoading}
				label="profile pic"
				value={profile_pic}
				onChange={(e) => {
					set_profile_pic(e.target.value);
				}}
			/>
			{register_user.isError ? (
				<p className="error-field">{register_user?.error?.response?.data?.message}</p>
			) : null}
			<FormControlLabel
				control={
					<Checkbox
						checked={private_account}
						onChange={(e) => {
							set_private_account(e.target.checked);
						}}
					/>
				}
				label="Private"
			/>
			<Button
				disabled={register_user.isLoading}
				onClick={() => {
					set_registration_step(0);
				}}
			>
				Back
			</Button>
			<Button type="submit">Next</Button>
		</form>,
	];

	return (
		<main className="login-page">
			<h1>Register</h1>
			{registration_step_forms[registration_step]}
		</main>
	);
};

export default RegisterPage;
