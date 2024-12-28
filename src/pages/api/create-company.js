import supabase from '../../utils/supabaseClient';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userId, companyName } = req.body;

    // Insert new company
    const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert([{ name: companyName, manager_id: userId }])
        .select('id')
        .single();

    if (companyError) {
        return res.status(500).json({ error: companyError.message });
    }

    // Update user's role to 'manager' and assign them to the company
    const { error: userError } = await supabase
        .from('users')
        .update({ role: 'manager', company_id: company.id })
        .eq('id', userId);

    if (userError) {
        return res.status(500).json({ error: userError.message });
    }

    res.status(200).json({ status: 'success', companyId: company.id });
}
