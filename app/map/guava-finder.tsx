export default async function guavaFinder(parsedState: any, setResponse: any) {
    try {
      console.log("Guava finder running...");
      const input = JSON.stringify(parsedState);
      console.log("the input to be passed into backend is ", input);
      const targetUrl = 'https://generate-route-93149730763.us-central1.run.app/';
      const res = await fetch(targetUrl, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: input,
      });

      const data = await res.json();
      console.log("the size of the array returned is", data.length);
      console.log("yo guavaFinder has finished", data);
      setResponse(data);
    } catch (error) {
      console.log("Failed to fetch from backend, error: ", error);
    }
  }
