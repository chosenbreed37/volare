import { v4 as uuidv4 } from 'uuid';
import { toSummary } from './applications';

test('application mapping', () => {
    const application = {
        id: uuidv4(),
        application_date: '2022-06-29T05:59:47.293Z',
        country: 'Burundi',
        status: 'submitted',
        form: '{"fullname":"John Doe", "nationality":"United Kingdom"}'
    };

    const summary = toSummary(application);
    expect(summary.fullname).toBe('John Doe');
    expect(summary.date).toBe('29 JUN 2022');
    expect(summary.country).toBe('Burundi');
    expect(summary.status).toBe('Submitted');
    expect(summary.nationality).toBe('United Kingdom');
});