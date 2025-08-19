export async function createAccount(payload: any) {
  var res = await fetch('/api/accounts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  return res.json()
}

export async function deleteAccount(accountId: number ){
  try {
    var res = await fetch('/api/accounts/'+accountId, {
      method: 'DELETE',
    })
    return res.json()
  } catch (error) {
    console.log(error)
  }
}
