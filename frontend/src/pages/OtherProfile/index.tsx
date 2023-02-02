import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { NavLink, useParams } from 'react-router-dom';

import { Comment, Favorite, FavoriteBorder } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import {
	Avatar,
	Button,
	ButtonBase,
	Fab,
	Grid,
	ImageList,
	ImageListItem,
	ImageListItemBar,
	Modal,
	Paper,
	TextField,
	Typography,
} from '@mui/material';
import { Box } from '@mui/system';

import styled from '@emotion/styled';
import { AxiosError } from 'axios';

import PostComponent from '@/components/Post';
import { get_other_user, get_user } from '@/services/users';
import { like_post, post_new, unlike_post } from '@/services/posts';
import useWebsocket from '@/services/useWebsocket';

const Img = styled('img')({
	margin: 'auto',
	display: 'block',
	maxWidth: '100%',
	maxHeight: '100%',
});

const style = {
	position: 'absolute',
	display: 'flex',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	maxWidth: 620,
	maxHeight: '70vh',
	bgcolor: 'white',
	border: '2px solid #fff',
	boxShadow: 24,
	p: 4,
	overflow: 'hidden',
};

const OtherProfile = () => {
	const queryClient = useQueryClient();

	const params = useParams();

	const param_username = params.username as string;

	const { data, isLoading, error } = useQuery('other_user', () => get_other_user(param_username));

	const [post_clicked, set_post_clicked] = useState<string | null>(null);
	const [modal_open, set_modal_open] = useState(false);

	// const { message, start_websocket, close_websocket } = useWebsocket();

	useEffect(() => {
		// if (data && !error && !isLoading) {
		// 	start_websocket();
		// }

		// else if (!data && error && !isLoading) {
		// set_start_websocket(false);
		// }
	}, [data, error, isLoading]);

	if (isLoading && error) {
		console.log({ error });
		return <h1>Loading...</h1>;
	}
	return (
		<Grid
			sx={{
				paddingLeft: '10rem',
				paddingRight: '10rem',
			}}
			className="home-page"
			component="main"
		>
			{!data ? (
				<>
					<Grid container spacing={2} alignItems="center">
						<Grid item>
							<NavLink to="/register">register</NavLink>
						</Grid>
						<Grid item>
							<NavLink to="/login">login</NavLink>
						</Grid>
					</Grid>
				</>
			) : (
				<Grid
					container
					direction="column"
					alignItems="center"
					justifyContent="space-between"
					className="home-content"
				>
					<Modal
						open={modal_open}
						onClose={() => {
							set_post_clicked(null);
							set_modal_open(false);
							queryClient.invalidateQueries('post');
						}}
					>
						<Box sx={style}>{post_clicked ? <PostComponent post_id={post_clicked} /> : <></>}</Box>
					</Modal>
					<Paper
						sx={{
							p: 2,
							maxWidth: 700,
							minWidth: 400,
							backgroundColor: '#fff',
							alignSelf: 'center',
						}}
					>
						<Grid container spacing={2}>
							<Grid item>
								<ButtonBase sx={{ width: 128, height: 128 }}>
									<Avatar
										variant="square"
										sx={{ width: '100%', height: '100%' }}
										src={data.profile_pic}
									></Avatar>
								</ButtonBase>
							</Grid>
							<Grid item xs={12} sm container>
								<Grid item xs container direction="column" spacing={2}>
									<Grid item xs>
										<Typography gutterBottom variant="subtitle1" component="div">
											{data.username}
										</Typography>
										<Typography variant="body2" gutterBottom>
											{data.name}
										</Typography>
										<Paper>
											<Typography variant="body2" color="text.secondary">
												Posts: {data.posts_count}
											</Typography>
										</Paper>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Paper>
					<ImageList
						className="image-list"
						sx={{ width: '75rem', height: 550 }}
						cols={4}
						variant="masonry"
						gap={8}
					>
						{data.posts.map((post, idx) => {
							return (
								<>
									<ImageListItem key={post.image_url + idx}>
										<Img src={post.image_url} alt={post.content} loading="lazy" />
										<button
											className="post-modal-button"
											onClick={() => {
												set_post_clicked(post.id);
												set_modal_open(true);
											}}
										></button>
										<ImageListItemBar
											className="image-bar"
											title={
												<NavLink className="router-link" to={`post/${post.id}`}>
													{post.content}
												</NavLink>
											}
											subtitle={post.poster}
											actionIcon={
												<Grid
													container
													alignItems="center"
													direction="row"
													wrap="nowrap"
													justifyContent="space-between"
												>
													<Grid container>
														{post.liked_by_post ? (
															<Favorite
																color="error"
																onClick={() => {
																	unlike_post(post.id).then(() => {
																		queryClient.invalidateQueries('other_user');
																	});
																}}
															/>
														) : (
															<FavoriteBorder
																color="error"
																onClick={() => {
																	like_post(post.id).then(() => {
																		queryClient.invalidateQueries('other_user');
																	});
																}}
															/>
														)}
														<Typography color="white">{post.number_likes}</Typography>
													</Grid>
													<Grid container justifyContent="flex-end">
														<Comment color="primary" />
														<Typography color="white">{post.number_comments}</Typography>
													</Grid>
												</Grid>
											}
										/>
									</ImageListItem>
								</>
							);
						})}
					</ImageList>
				</Grid>
			)}
		</Grid>
	);
};

export default OtherProfile;
