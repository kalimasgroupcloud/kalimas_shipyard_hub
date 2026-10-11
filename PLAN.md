# PLAN.md

## Contract

```json
{
  "allowed_operations": [
    {
      "path": "README.md",
      "operation": "CREATE"
    }
  ],
  "validation_contract": [
    {
      "path": "README.md",
      "expected_bytes_utf8": "# KALIMAS Maritime Hub Demo\n"
    }
  ]
}
```