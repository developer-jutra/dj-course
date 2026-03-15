from hypothesis import Phase, HealthCheck, settings

# Schemathesis registers and activates the 'ci' profile via its pytest plugin.
# We override it here to restrict to Phase.explicit only – meaning Hypothesis
# will execute only the examples defined in the OpenAPI contract (via `example:` fields)
# and skip random data generation (fuzzing) entirely.
settings.register_profile(
    "ci",
    phases=[Phase.explicit],
    suppress_health_check=[HealthCheck.too_slow],
    derandomize=True,
    deadline=None,
    print_blob=True,
)
