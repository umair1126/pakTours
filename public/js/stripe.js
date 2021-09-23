// const axios = require("axios");

// var stripe = Stripe(
//   "pk_test_51JcMe8Hkgg1R6c1BNMK9gKMWryk1q7oTPlOr8LcdXjOTlw28gxmSHw7w1M52jPUWztH01nYsJ4ScZ4zgcnhgJe2F00NUoShV5A"
// );

// export const bookTour = async (tourId) => {
//   try {
//     //1: get checkout session from api
//     const session = await axios(
//       `http://127.0.0.1:7000/api/b1/booking/checkout-session/${tourId}`
//     );

//     //2: create checkout form +
//     await stripe.redirectToCheckout({
//       sessionId: session.data.session.id,
//     });
//   } catch (error) {
//     console.log(error);
//     showAlert("error", error);
//   }
// };
