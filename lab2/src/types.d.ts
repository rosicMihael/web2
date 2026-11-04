interface SqlInjectionResult {
    query: string;
    result: any;
    is_successful: boolean;
}

interface BrokenAuthResult {
    correct_username: boolean;
    correct_password: boolean;
    db_username: string;
    db_password: string;
}

interface LoginResult {
    is_valid: boolean;
    password_hash: string;
}

interface Bucket {
    level: number;
    lastUpdated: number;
}
