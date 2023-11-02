export const fetcher = (url: string) => 
  fetch(url, {
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${localStorage.getItem('access_token')}` 
    } 
  })
  .then(async (res) => await res.json())
