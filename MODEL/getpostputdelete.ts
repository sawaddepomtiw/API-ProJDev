export interface User {
    email:    string;
    name:     string;
    password: string;
    profile:  string;
    role:     string;
    uid:      number;
}

export interface ImageModel {
    imid:      number;
    uid:       number;
    name:      string;
    score:     number;
    voteTOTAL: number;
    url:       string;
}

export interface VoteModel {
    vid:       number;
    uid:       number;
    imid:      number;
    timestamp: Date;
    status:    number;
}