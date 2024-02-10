export const validate = (name, value) => {
    let error = "";
  
    switch (name) {
      case "text": 
        if (value.length < 3) {
          error = "Text must be at least 3 characters";
        }
        break;
      case "fullname":
        if (value.length < 3) {
          error = "Fullname must be at least 3 characters";
        }
        break;
      case "email":
        if (!value.includes("@")) {
          error = "Email must include @";
        }
        break;
      case "password":
        let regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
        if (!regex.test(value)) {
          error =
            "Password must be at least 8 characters, including uppercase, lowercase and number";
        }
        break;
      case "ageRange":
        if (!value) {
          error = "Age Range is required";
        }
        break;
      default:
        break;
    }
  
    return error;
  };