export default async function guavaFinder(parsedState: any, setResponse: any) {
    try {
      console.log("Guava finder running...");
      const input = JSON.stringify(parsedState);
      
      const targetUrl = 'https://python-http-function-93149730763.us-central1.run.app/';
      const res = await fetch(targetUrl, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{"start_lat": 42.062365, "start_lon": -87.677904, "distance": 5}'
        // body: input,
      });

      const data = await res.json();
      console.log("the size of the array returned is", data.length);
      console.log("yo guavaFinder has finished", data);
      setResponse(data);
    } catch (error) {
      console.log("Failed to fetch from backend, error: ", error);
    }
  }
