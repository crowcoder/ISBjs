ISBjs
=====
Interactive Search Builder for javascript is a drop-in "widget" that gives your end users the power to construct simple or complex queries. ISBjs does not interact with your data store, but it does provide an intuitive UI that generates a configurable "WHERE" clause suitable for use in your backend. 
It supports four different styles of parsing:

Parse to dynamic Linq - this parse method returns a string that is appropriate for use in the WHERE clause of a System.Linq.Dynamic query expression.

Parse to SQL - Not using Linq? You can also parse to a standard SQL clause for use in general querying/procedures. This method requires more server-side work on your part because it would be dangerously easy to implement sql injection. Not yet considered production ready.

Parse to OData - this generates a string suitable for use in an OData query. This feature was built by referencing the OData spec, but it is as yet untested. Do not consider this production ready.

Parse to PostFix - The search expression in postfix notation to facilitate chaining your own expression trees in .Net or any language that supports such constructs. 
