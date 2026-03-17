import requests
base='http://127.0.0.1:8000/api/'
rt=requests.post('http://127.0.0.1:8000/api/token/', json={'username':'testuserx2','password':'test1234'})
print('token', rt.status_code, rt.text)
tok=rt.json().get('access')
if not tok:
    raise SystemExit('no token')
headers={'Authorization':f'Bearer {tok}'}
re=requests.post(base+'events/', json={'title':'API event','description':'x','location':'x','date':'2026-03-18T12:00:00Z'}, headers=headers)
print('create', re.status_code, re.text)
rr=requests.get(base+'events/', headers=headers)
print('events', rr.status_code, rr.text)
