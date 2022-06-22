import { saveApplication, getApplications } from '../services/datastore';

test('adds 1 + 2 to equal 3', () => {
    expect(1 + 2).toBe(3);
});

test('get application test', async () => {
    // getApplications('chosenbreed@gmail.com')
    //     .then(results => console.log('>>> results: ', JSON.stringify(results)))
    //     .catch(error => console.log('>>> boom boom: ', error));
    const results = await getApplications('chosenbreed@gmail.com');
    console.log('>>> results: ', JSON.stringify(results));
});