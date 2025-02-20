import * as yup from 'yup'

export default yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Le nom doit faire plus de 3 characters')
    .max(15, 'Le nom doit faire pas dépasser 3 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Le nom ne doit avoir que des lettres et des espaces'),
  email: yup.string().required('Un email est requis').email("L'email doit être valide"),
  age: yup
    .number()
    .required('Age requis')
    .min(18, "L'âge doit être de plus de 18 ans")
    .max(130, "L'âge ne doit pas dépasser 130 ans"),
  password: yup
    .string()
    .required('Mot de passe requis')
    .min(5, 'Le mot de passe ne doit pas dépasser 5 characters')
    .max(100, 'Le mot de passe ne doit pas dépasser 100 characters')
    .notOneOf(['password'], 'Le mot de passe ne peut pas être: "password"'),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Les mot de passes ne correspondent pas')
    .required('Veuillez confirmer le mot de passe'),
  tos: yup.boolean().oneOf([true], 'Vous devez accepter les termes'),
})
