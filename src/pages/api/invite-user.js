import supabase from '../../utils/supabaseClient';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, companyId } = req.body;

    const { error } = await supabase
        .from('company_invites')
        .insert([{ email, company_id: companyId }]);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ status: 'success', message: 'Invitation sent.' });
}
