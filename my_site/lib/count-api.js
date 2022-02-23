/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
async function getCount(orderId) {
  return fetch(process.env.NEXT_PUBLIC_COUNT_ENDPOINT, {
    method: "post",
    body: JSON.stringify({
      orderID: orderId,
    }),
  });
}

export async function displayCount(orderId, updateCountCallback) {
  let response = await getCount(orderId);
  let responseJson = await response.json();
  console.log(`STATUS: ${response.status}`);
  if (response.status === 200) {
    updateCountCallback(responseJson.count, responseJson.isNewCount);
  } else {
    console.log(
      `Return code: ${response.status}, \nJSON error: ${JSON.stringify(
        responseJson
      )}`
    );
    alert(JSON.stringify(responseJson));
  }
}
