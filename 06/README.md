144

```
<--- Last few GCs --->

[50011:0x1046f1000]    32748 ms: Scavenge 2610.6 (2644.2) -> 2610.6 (2644.2) MB, 85.4 / 0.0 ms  (average mu = 0.898, current mu = 0.893) allocation failure


<--- JS stacktrace --->

FATAL ERROR: invalid array length Allocation failed - JavaScript heap out of memory
 1: 0x1012d8685 node::Abort() (.cold.1) [/Users/ben/.nvm/versions/node/v14.15.3/bin/node]
 2: 0x1000a6309 node::Abort() [/Users/ben/.nvm/versions/node/v14.15.3/bin/node]
 3: 0x1000a646f node::OnFatalError(char const*, char const*) [/Users/ben/.nvm/versions/node/v14.15.3/bin/node]
 4: 0x1001e8cc7 v8::Utils::ReportOOMFailure(v8::internal::Isolate*, char const*, bool) [/Users/ben/.nvm/versions/node/v14.15.3/bin/node]
 5: 0x1001e8c63 v8::internal::V8::FatalProcessOutOfMemory(v8::internal::Isolate*, char const*, bool) [/Users/ben/.nvm/versions/node/v14.15.3/bin/node]
 6: 0x100395b65 v8::internal::Heap::FatalProcessOutOfMemory(char const*) [/Users/ben/.nvm/versions/node/v14.15.3/bin/node]
 7: 0x10036d8e6 v8::internal::Factory::NewUninitializedFixedArray(int) [/Users/ben/.nvm/versions/node/v14.15.3/bin/node]
 8: 0x1004f71f2 v8::internal::(anonymous namespace)::ElementsAccessorBase<v8::internal::(anonymous namespace)::FastHoleySmiElementsAccessor, v8::internal::(anonymous namespace)::ElementsKindTraits<(v8::internal::ElementsKind)1> >::GrowCapacity(v8::internal::Handle<v8::internal::JSObject>, unsigned int) [/Users/ben/.nvm/versions/node/v14.15.3/bin/node]
 9: 0x1006c4804 v8::internal::Runtime_GrowArrayElements(int, unsigned long*, v8::internal::Isolate*) [/Users/ben/.nvm/versions/node/v14.15.3/bin/node]
10: 0x100a71679 Builtins_CEntry_Return1_DontSaveFPRegs_ArgvOnStack_NoBuiltinExit [/Users/ben/.nvm/versions/node/v14.15.3/bin/node]
11: 0x104002d442d1
12: 0x100a0aa22 Builtins_InterpreterEntryTrampoline [/Users/ben/.nvm/versions/node/v14.15.3/bin/node]
13: 0x100a0aa22 Builtins_InterpreterEntryTrampoline [/Users/ben/.nvm/versions/node/v14.15.3/bin/node]
```