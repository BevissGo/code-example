import * as Yup from 'yup'

export const positionSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  categoryTest: Yup.array().min(1, 'Choose at least one test'),
  fitDISCScore: Yup.array().when('categoryTest', {
    is: (categoryTest) => categoryTest.includes('DISCScore'),
    then: Yup.array().min(1, 'Choose at least one result'),
  }),
  fitIqScore: Yup.string().when('categoryTest', {
    is: (categoryTest) => categoryTest.includes('IqScore'),
    then: Yup.string().required('Required'),
  }),
  fitEqScore: Yup.string().when('categoryTest', {
    is: (categoryTest) => categoryTest.includes('EqScore'),
    then: Yup.string().required('Required'),
  }),
  fitBrainScore: Yup.array().when('categoryTest', {
    is: (categoryTest) => categoryTest.includes('BrainScore'),
    then: Yup.array().min(1, 'Choose at least one result'),
  }),
  extraQuestion: Yup.array(),
  // testTime: Yup.object()
  //   .when('categoryTest', {
  //     is: (categoryTest) => categoryTest.includes('DISCScore'),
  //     then: Yup.object({
  //       DISCScore: Yup.number().required('Required').min(1, 'Must be greater than or equal to 1'),
  //     }),
  //   })
  //   .when('categoryTest', {
  //     is: (categoryTest) => categoryTest.includes('IqScore'),
  //     then: Yup.object({
  //       IqScore: Yup.number().required('Required').min(1, 'Must be greater than or equal to 1'),
  //     }),
  //   })
  //   .when('categoryTest', {
  //     is: (categoryTest) => categoryTest.includes('EqScore'),
  //     then: Yup.object({
  //       EqScore: Yup.number().required('Required').min(1, 'Must be greater than or equal to 1'),
  //     }),
  //   })
  //   .when('categoryTest', {
  //     is: (categoryTest) => categoryTest.includes('BrainScore'),
  //     then: Yup.object({
  //       BrainScore: Yup.number().required('Required').min(1, 'Must be greater than or equal to 1'),
  //     }),
  //   }),
})
