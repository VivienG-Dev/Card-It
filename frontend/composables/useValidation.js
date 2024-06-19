/**
 * Custom composable function for validation.
 *
 * @returns {{
 *   usernameError: Ref<string>,
 *   emailError: Ref<string>,
 *   passwordError: Ref<string>,
 *   validateUsername: (username: string) => void,
 *   validateEmail: (email: string) => void,
 *   validatePassword: (password: string) => void,
 *   titleError: Ref<string>,
 *   descriptionError: Ref<string>,
 *   colorError: Ref<string>,
 *   validateTitle: (title: string) => void,
 *   validateDescription: (description: string) => void,
 *   validateColor: (color: string) => void
 * }}
 */
export function useValidation() {
  const usernameError = ref("");
  const emailError = ref("");
  const passwordError = ref("");
  const titleError = ref("");
  const descriptionError = ref("");
  const colorError = ref("");

  const validateUsername = (username) => {
    username.length < 4
      ? (usernameError.value = "Username must be at least 4 characters long.")
      : (usernameError.value = "");
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    email.match(emailRegex) ? (emailError.value = "") : (emailError.value = "Please enter a valid email address.");
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    password.match(passwordRegex)
      ? (passwordError.value = "")
      : (passwordError.value =
          "Password must be at least 8 characters long, include uppercase and lowercase letters, and contain a number.");
  };

  const validateTitle = (title) => {
    const maxLength = 30;
    if (title.length < 1) {
      titleError.value = "Title cannot be empty.";
    } else if (title.length > maxLength) {
      titleError.value = `Title cannot exceed ${maxLength} characters.`;
    } else if (sanitizeInput(title) !== title) {
      titleError.value = "Title contains invalid characters.";
    } else {
      titleError.value = "";
    }
  };

  const validateDescription = (description) => {
    const maxLength = 160;
    if (description.length > maxLength) {
      descriptionError.value = `Description cannot exceed ${maxLength} characters.`;
    } else if (sanitizeInput(description) !== description) {
      descriptionError.value = "Description contains invalid characters.";
    } else {
      descriptionError.value = "";
    }
  };

  const validateColor = (color) => {
    const colorRegex = /^#[0-9A-Fa-f]{6}$/;
    color.match(colorRegex)
      ? (colorError.value = "")
      : (colorError.value = "Color must be in hex format (e.g., #141A1F).");
  };

  const sanitizeInput = (input) => {
    const tagBody = "(?:[^\"'>]|\"[^\"]*\"|'[^']*')*";
    const tagOrComment = new RegExp(
      "<(?:" +
        // Comment body.
        "!--(?:(?:-*[^->])*--+|-?)" +
        // Special "raw text" elements whose content should be elided.
        "|script\\b" +
        tagBody +
        ">[\\s\\S]*?</script\\s*" +
        "|style\\b" +
        tagBody +
        ">[\\s\\S]*?</style\\s*" +
        // Regular name
        "|/?[a-z]" +
        tagBody +
        ")>",
      "gi"
    );
    let oldInput;
    do {
      oldInput = input;
      input = input.replace(tagOrComment, "");
    } while (input !== oldInput);
    return input.replace(/</g, "&lt;");
  };

  return {
    usernameError,
    emailError,
    passwordError,
    validateUsername,
    validateEmail,
    validatePassword,
    titleError,
    descriptionError,
    colorError,
    validateTitle,
    validateDescription,
    validateColor,
  };
}
