const getRecipientEmail = (users, userLoggedIn) =>
  users?.filter((userToFind) => userToFind !== userLoggedIn)[0]

export default getRecipientEmail
