-- Insert default categories
INSERT INTO categories (name) VALUES 
    ('Custom GPT Tools'),
    ('Marketing Automation'),
    ('Strategy Automation')
ON CONFLICT (name) DO NOTHING;

-- Insert sample users
INSERT INTO users (name, email, role) VALUES 
    ('Admin User', 'admin@workforcegroup.com', 'Administrator'),
    ('Team Member', 'team@workforcegroup.com', 'User')
ON CONFLICT (email) DO NOTHING;

-- Insert sample automation links
INSERT INTO automation_links (title, description, url, category) VALUES 
    (
        'Business Process Automation',
        'Streamline and automate complex business workflows and processes',
        'https://chatgpt.com/g/g-6847f1633f10819192f9893e0997dd53-process-automation-guru',
        'Custom GPT Tools'
    ),
    (
        'Playbook HRFlix Generator',
        'Generate comprehensive HR training materials and documentation',
        'https://chatgpt.com/g/g-684702a7b9b88191b017c0d57b41b27f-master-playbook-generator',
        'Custom GPT Tools'
    ),
    (
        'Playbook QA Expert',
        'Quality assurance and testing automation for playbooks and processes',
        'https://chatgpt.com/g/g-68471985a68c8191ae47fbc3fc6ae7e9-playbook-r-u-qa-expert',
        'Custom GPT Tools'
    ),
    (
        'Marketing Content Automation',
        'Automated content creation and distribution for marketing campaigns',
        'https://zonetechpark.github.io/video-2-slides-transcriber/',
        'Marketing Automation'
    ),
    (
        'HR Marketing Playbooks',
        'Marketing strategies and playbooks specifically designed for HR departments',
        'https://chatgpt.com/g/g-683efe2755c48191855245b8d3cea929-hr-playbooks-marketing-expert',
        'Marketing Automation'
    ),
    (
        'Workforce Strategy Advisor',
        'Strategic workforce planning and optimization recommendations',
        'https://chatgpt.com/g/g-67a245eed0f88191abe301cfa28654b0-workforce-strategy-advisor',
        'Strategy Automation'
    ),
    (
        'Proposal Generator',
        'Automated proposal creation and customization for strategic initiatives',
        'https://chatgpt.com/g/g-6820497e4de48191bd904b3fedd57b31-smart-ai-proposal-generator',
        'Strategy Automation'
    )
ON CONFLICT DO NOTHING;
