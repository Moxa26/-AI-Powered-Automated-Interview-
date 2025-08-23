import ace from 'ace-builds/src-noconflict/ace';

// Configure ACE Editor to disable workers and prevent loading errors
export const configureAceEditor = () => {
  // Disable workers to prevent script loading errors
  ace.config.set('useWorker', false);
  ace.config.set('workerPath', false);
  
  // Set the base path for ace modules (optional, for future use)
  if (process.env.NODE_ENV === 'production') {
    const basePath = process.env.PUBLIC_URL || '';
    ace.config.set('basePath', `${basePath}/static/js`);
  }
  
  // Disable worker-based features that cause loading issues
  ace.config.set('loadWorkerFromBlob', false);
  
  console.log('ACE Editor configured successfully - workers disabled');
};

// Map programming languages to ACE Editor modes
export const getAceMode = (language: string): string => {
  const languageMap: { [key: string]: string } = {
    'javascript': 'javascript',
    'typescript': 'typescript', 
    'python': 'python',
    'java': 'java',
    'go': 'golang',
    'rust': 'rust',
    'html': 'html',
    'csharp': 'csharp',
    'c#': 'csharp',
    'sql': 'sql',
    'json': 'json',
    'css': 'css',
    'xml': 'xml'
  };
  
  return languageMap[language.toLowerCase()] || 'text';
};

// Default ACE Editor options that work well without workers
export const getAceEditorOptions = () => ({
  enableBasicAutocompletion: false,
  enableLiveAutocompletion: false,
  enableSnippets: false,
  showLineNumbers: true,
  tabSize: 2,
  useWorker: false,
  showPrintMargin: true,
  highlightActiveLine: true,
  wrap: false,
  fontSize: 14
});