### Logic building | Login controller ([link here](https://www.youtube.com/watch?v=7DVpag3cO0g))

Login User

1. Get user Details from Frontend (Postman)
   - req.body => data => [ username or email ]
2. find user by username or email exist or not.
3. check if user password is correct or not.
4. check access and refresh token.
5. send inside the cookies

```js
/**
  !) Login User
  ?1) Retrieve user details from the frontend (using Postman) through the request body, specifically accessing data such as username or email.
  ?2) Determine whether a user with the provided username or email exists in the system.
  ?3) Verify the accuracy of the entered password against the stored user credentials.
  ?4) Validate and generate both access and refresh tokens for the user.
  ?5) Transmit the tokens securely by embedding them within cookies, ensuring secure and authenticated access for the user.
*/
```

```js
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username) {
    throw new ApiError(400, "email or username is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  if (!accessToken && !refreshToken) {
    throw new ApiError(401, "something went wrong while creating token");
  }

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .cookies("accessToken", accessToken, options)
    .cookies("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        { message: "User successfully login" }
      )
    );
});
```
