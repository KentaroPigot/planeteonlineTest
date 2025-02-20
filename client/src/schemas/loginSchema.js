import * as yup from 'yup'

export default yup.object().shape({
  email: yup.string().required('Email requis').email("L'email doit être valide"),
  password: yup
    .string()
    .required('Mot de passe requis')
    .min(5, "Le mot de passe doit être d'au moins 5 caractères")
    .max(30, 'Le mot de passe ne peut pas dépasser 30 caractères'),
})
